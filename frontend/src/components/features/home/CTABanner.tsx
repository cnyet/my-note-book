"use client";

export const CTABanner = () => {
  return (
    <section className="mt-32 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[60px] p-16 md:p-32 text-center relative overflow-hidden group">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative z-10">
        <h2 className="text-5xl md:text-8xl font-black mb-10 tracking-tighter text-white leading-[0.9]">
          Ready to <br />
          Transform?
        </h2>
        <button className="bg-white text-slate-950 px-12 py-6 rounded-[24px] font-black text-2xl hover:scale-110 transition-all active:scale-95 shadow-2xl shadow-black/20">
          Start Free Trial
        </button>
      </div>
    </section>
  );
};
