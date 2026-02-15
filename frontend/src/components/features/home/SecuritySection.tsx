"use client";

import { EyeOff, Fingerprint, Lock, ShieldCheck } from "lucide-react";

export const SecuritySection = () => {
  return (
    <section className="py-12 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto backdrop-blur-md bg-white/5 rounded-[80px] p-16 md:p-32 border border-white/5 flex flex-col lg:flex-row items-center gap-20 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px]"></div>
        <div className="lg:w-1/2 space-y-8 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
            <Lock size={28} />
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
            Your Data. <br />
            Isolated.
          </h2>
          <p className="text-slate-400 text-xl font-medium leading-relaxed">
            Security isn't a feature; it's our foundation. Every notebook
            instance runs in a strictly isolated sandbox with end-to-end
            encryption by default.
          </p>
          <ul className="space-y-4">
            {[
              {
                icon: <ShieldCheck size={18} />,
                text: "SOC2 Type II Certified Infrastructure",
              },
              {
                icon: <Fingerprint size={18} />,
                text: "Biometric & MFA Hardware Support",
              },
              {
                icon: <EyeOff size={18} />,
                text: "Zero-Knowledge Data Residency",
              },
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-4 text-slate-300 font-bold"
              >
                <span className="text-indigo-500">{item.icon}</span>
                {item.text}
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:w-1/2 flex justify-center relative">
          <div className="relative w-80 h-80 md:w-[450px] md:h-[450px]">
            <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-[80px] animate-pulse"></div>
            <div className="relative h-full w-full bg-slate-950/80 rounded-[60px] border border-white/10 flex flex-col items-center justify-center overflow-hidden shadow-3xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
              <div className="w-24 h-24 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 animate-bounce">
                <ShieldCheck size={48} />
              </div>
              <div className="mt-10 grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-12 h-1.5 rounded-full bg-white/10"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
