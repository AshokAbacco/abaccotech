import React, { useState, useEffect } from 'react';
import { Zap, Globe, Database, Cloud, Server, Cpu, Code, Smartphone, Lock, Wifi, HardDrive, Boxes, Network, GitBranch, Terminal, Layers, Braces, Webhook, Container, CloudCog, Binary } from 'lucide-react';

const FloatingIcon = ({ icon: Icon, delay, duration, x, y, size }) => {
  return (
    <div
      className="absolute animate-float-complex opacity-15 hover:opacity-70 transition-opacity duration-500 cursor-pointer"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animation: `floatComplex ${duration}s ease-in-out ${delay}s infinite, pulse ${duration * 0.5}s ease-in-out ${delay}s infinite`,
      }}
    >
      <Icon className={`${size} text-green-500 drop-shadow-[0_0_8px_rgba(19,236,99,0.6)]`} />
    </div>
  );
};

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const techIcons = [
    { icon: Globe, delay: 0, duration: 6, x: 8, y: 15, size: 'w-10 h-10' },
    { icon: Database, delay: 0.8, duration: 7, x: 88, y: 20, size: 'w-9 h-9' },
    { icon: Cloud, delay: 1.2, duration: 5.5, x: 12, y: 75, size: 'w-11 h-11' },
    { icon: Server, delay: 1.8, duration: 6.5, x: 85, y: 70, size: 'w-10 h-10' },
    { icon: Cpu, delay: 2.2, duration: 5, x: 3, y: 45, size: 'w-12 h-12' },
    { icon: Code, delay: 2.8, duration: 7, x: 92, y: 48, size: 'w-9 h-9' },
    { icon: Smartphone, delay: 0.5, duration: 6.5, x: 18, y: 35, size: 'w-8 h-8' },
    { icon: Lock, delay: 1.5, duration: 5.5, x: 78, y: 85, size: 'w-10 h-10' },
    { icon: Wifi, delay: 2.5, duration: 6, x: 25, y: 60, size: 'w-9 h-9' },
    { icon: HardDrive, delay: 3, duration: 7, x: 70, y: 30, size: 'w-11 h-11' },
    { icon: Boxes, delay: 0.3, duration: 5.8, x: 5, y: 82, size: 'w-10 h-10' },
    { icon: Network, delay: 1, duration: 6.2, x: 95, y: 35, size: 'w-9 h-9' },
    { icon: GitBranch, delay: 1.7, duration: 5.3, x: 15, y: 25, size: 'w-8 h-8' },
    { icon: Terminal, delay: 2.3, duration: 6.8, x: 82, y: 55, size: 'w-10 h-10' },
    { icon: Layers, delay: 2.9, duration: 5.7, x: 30, y: 18, size: 'w-11 h-11' },
    { icon: Braces, delay: 3.2, duration: 6.3, x: 65, y: 12, size: 'w-9 h-9' },
    { icon: Webhook, delay: 0.7, duration: 7.2, x: 38, y: 78, size: 'w-10 h-10' },
    { icon: Container, delay: 1.3, duration: 5.9, x: 58, y: 88, size: 'w-8 h-8' },
    { icon: CloudCog, delay: 1.9, duration: 6.6, x: 92, y: 15, size: 'w-12 h-12' },
    { icon: Binary, delay: 2.6, duration: 5.4, x: 48, y: 8, size: 'w-9 h-9' },
  ];

  return (
    <>
      <style>{`
        @keyframes floatComplex {
          0% {
            transform: translateY(0px) translateX(0px) rotate(0deg) scale(1);
          }
          15% {
            transform: translateY(-35px) translateX(25px) rotate(8deg) scale(1.1);
          }
          30% {
            transform: translateY(-15px) translateX(-20px) rotate(-12deg) scale(0.95);
          }
          45% {
            transform: translateY(-45px) translateX(15px) rotate(5deg) scale(1.05);
          }
          60% {
            transform: translateY(-20px) translateX(-30px) rotate(-8deg) scale(0.9);
          }
          75% {
            transform: translateY(-40px) translateX(10px) rotate(10deg) scale(1.08);
          }
          90% {
            transform: translateY(-10px) translateX(-15px) rotate(-5deg) scale(0.98);
          }
          100% {
            transform: translateY(0px) translateX(0px) rotate(0deg) scale(1);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.15;
            filter: drop-shadow(0 0 8px rgba(19,236,99,0.6));
          }
          50% {
            opacity: 0.4;
            filter: drop-shadow(0 0 15px rgba(19,236,99,0.9));
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes serviceFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(3deg);
          }
        }
        
         
        @keyframes cursorPulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
          }
        }
      `}</style>

      <div className="relative z-10 overflow-hidden">
        {/* Animated cursor glow */}
        <div
          className="cursor-glow"
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
          }}
        />

        {/* Floating Tech Icons Background - MORE ICONS */}
        <div className="absolute inset-0 overflow-hidden">
          {techIcons.map((item, index) => (
            <FloatingIcon key={index} {...item} />
          ))}
        </div>

        {/* Hero Section */}
        <div className="container mx-auto px-6 pt-15 pb-15">
          <div className="text-center transition-all duration-700">
            <div className="w-full flex justify-center mb-6">
              <div className="relative h-42 w-32 flex items-center justify-center">
                {/* Rotating dots circle 1 */}
                <svg
                  className="absolute inset-0 w-full h-full animate-spin"
                  style={{ animationDuration: '3s' }}
                >
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    fill="none"
                    stroke="rgba(19, 236, 99, 0.71)"
                    strokeWidth="3"
                    strokeDasharray="2 8"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Rotating dots circle 2 - opposite direction */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  style={{ animation: 'spin 16s linear infinite reverse' }}
                >
                  <circle
                    cx="50%"
                    cy="50%"
                    r="35%"
                    fill="none"
                    stroke="rgba(1, 255, 94, 0.7)"
                    strokeWidth="3"
                    strokeDasharray="2 8"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Pulsing glow */}
                <div className="absolute inset-0  rounded-full blur-xl animate-pulse"></div>

                {/* Static image */}
                <img
                  src="/Logo/icon.png"
                  alt=""
                  className="relative z-10 h-42 w-32 object-contain drop-shadow-2xl"
                />
              </div>
            </div>

            <div className="inline-block mb-6">
              <div className="flex items-center gap-3 bg-gradient-to-r from-green-500/20 to-green-600/20 px-6 py-3 rounded-full border border-green-500/30">
                <Zap className="w-5 h-5 text-[#019101] animate-pulse" />
                <span className="text-sm font-medium text-gray-300">
                  Powering Digital Innovation
                </span>
              </div>
            </div>

            <h1 className="text-5xl md:text-8xl font-bold mb-8 py-5 text-white">
              Abacco Technology
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Transforming businesses with modern digital solutions from high
              performance websites to intelligent cloud and CRM platforms
              tailored to your growth.
            </p>

            {/* Service Icons Grid */}
            {/* <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto mt-16">
              {[
                { icon: Globe, label: 'Website Designing' },
                { icon: Cpu, label: 'CRM Development' },
                { icon: Code, label: 'Application Development' },
                { icon: Cloud, label: 'Cloud Management' },
                { icon: Database, label: 'Database Management' },
                { icon: Server, label: 'AWS Services' },
              ].map((service, index) => (
                <div
                  key={index}
                  className="group relative p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-2xl border border-green-500/20 hover:border-green-500/60 transition-all duration-500 hover:scale-125 hover:shadow-2xl hover:shadow-green-500/40 cursor-pointer"
                  style={{
                    animation: `serviceFloat ${4 + index * 0.4}s ease-in-out ${index * 0.3}s infinite`,
                  }}
                >
                  <service.icon className="w-10 h-10 text-green-500 mx-auto mb-3 group-hover:text-green-400 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                  <p className="text-xs text-gray-400 font-medium text-center group-hover:text-gray-200 transition-colors">
                    {service.label}
                  </p>
                  <div className="absolute inset-0 bg-green-500/0 group-hover:bg-green-500/10 rounded-2xl transition-all duration-500 blur-sm"></div>
                  
              
                  <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}