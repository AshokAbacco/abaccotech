// routes/vendor.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import { protect } from "../middleware/authMiddleware.js";

const prisma = new PrismaClient();
const router = express.Router();

// 📁 Make sure the uploads folder exists
const uploadDir = path.join(process.cwd(), "uploads", "vendors");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 🗂️ Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const safeBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_");
    cb(null, `${safeBase}-${uniqueSuffix}${ext}`);
  },
});

// ✅ Allowed file types: images + documents
const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.ms-excel", // .xls
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
];

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed: ${file.mimetype}`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 12, // aadhaar(1) + pan(1) + other docs(up to 10)
  },
});

// 📌 Accept three separate upload fields:
//   - aadhaarFile : single Aadhaar card upload
//   - panFile     : single PAN card upload
//   - files       : multiple general/other documents
const uploadFields = upload.fields([
  { name: "aadhaarFile", maxCount: 1 },
  { name: "panFile", maxCount: 1 },
  { name: "files", maxCount: 10 },
]);

// ✅ Basic KYC format validators (kept lenient — warn, don't hard-block, unless clearly wrong length)
const isValidAadhaar = (val) => !val || /^\d{12}$/.test(val);
const isValidPAN = (val) => !val || /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(val);
const isValidIFSC = (val) => !val || /^[A-Z]{4}0[A-Z0-9]{6}$/i.test(val);

// 🟢 POST /vendor  — create/update the logged-in user's vendor KYC + bank details + file uploads
// Requires auth so we know WHICH user this submission belongs to (req.user.userId).
router.post("/", protect, uploadFields, async (req, res) => {
  try {
    const {
      fullName,
      phone,
      email,
      websiteUrl,
      aadhaarNumber,
      panNumber,
      bankAccountNumber,
      bankName,
      ifscCode,
      branchName,
    } = req.body;

    if (!fullName || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: "Full name, phone, and email are required.",
      });
    }

    if (!isValidAadhaar(aadhaarNumber)) {
      return res.status(400).json({
        success: false,
        message: "Aadhaar number must be exactly 12 digits.",
      });
    }

    if (!isValidPAN(panNumber)) {
      return res.status(400).json({
        success: false,
        message: "PAN number format is invalid (e.g. ABCDE1234F).",
      });
    }

    if (!isValidIFSC(ifscCode)) {
      return res.status(400).json({
        success: false,
        message: "IFSC code format is invalid (e.g. HDFC0001234).",
      });
    }

    // 🗃️ Build the files list, tagging each with its docType
    const aadhaarFile = req.files?.aadhaarFile?.[0];
    const panFile = req.files?.panFile?.[0];
    const otherFiles = req.files?.files || [];

    const fileRecords = [];

    if (aadhaarFile) {
      fileRecords.push({
        fileName: aadhaarFile.originalname,
        filePath: `/uploads/vendors/${aadhaarFile.filename}`,
        fileType: aadhaarFile.mimetype,
        fileSize: aadhaarFile.size,
        docType: "AADHAAR",
      });
    }

    if (panFile) {
      fileRecords.push({
        fileName: panFile.originalname,
        filePath: `/uploads/vendors/${panFile.filename}`,
        fileType: panFile.mimetype,
        fileSize: panFile.size,
        docType: "PAN",
      });
    }

    otherFiles.forEach((f) => {
      fileRecords.push({
        fileName: f.originalname,
        filePath: `/uploads/vendors/${f.filename}`,
        fileType: f.mimetype,
        fileSize: f.size,
        docType: "OTHER",
      });
    });

    const vendorData = {
      fullName,
      phone,
      email,
      websiteUrl: websiteUrl || null,
      aadhaarNumber: aadhaarNumber || null,
      panNumber: panNumber ? panNumber.toUpperCase() : null,
      bankAccountNumber: bankAccountNumber || null,
      bankName: bankName || null,
      ifscCode: ifscCode ? ifscCode.toUpperCase() : null,
      branchName: branchName || null,
    };

    // 🟢 One vendor record per user: create on first submission,
    // update (and append any newly uploaded files) on resubmission.
    const vendor = await prisma.vendor.upsert({
      where: { userId: req.user.userId },
      create: {
        ...vendorData,
        userId: req.user.userId,
        files: { create: fileRecords },
      },
      update: {
        ...vendorData,
        ...(fileRecords.length > 0 && { files: { create: fileRecords } }),
      },
      include: { files: true },
    });

    return res.status(201).json({
      success: true,
      message: "Vendor registered successfully!",
      vendor,
    });
  } catch (err) {
    console.error("❌ Vendor creation error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while saving vendor details.",
    });
  }
});

// 🟢 GET /vendor — list all vendors (admin use)
router.get("/", async (req, res) => {
  try {
    const vendors = await prisma.vendor.findMany({
      include: { files: true },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ success: true, vendors });
  } catch (err) {
    console.error("❌ Vendor fetch error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch vendors." });
  }
});

// 🟢 GET /vendor/:id — get single vendor
router.get("/:id", async (req, res) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id: Number(req.params.id) },
      include: { files: true },
    });
    if (!vendor) {
      return res.status(404).json({ success: false, message: "Vendor not found." });
    }
    return res.json({ success: true, vendor });
  } catch (err) {
    console.error("❌ Vendor fetch error:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch vendor." });
  }
});

// 🛑 Multer error handler (file too large, too many files, wrong type, etc.)
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
});

export default router;