"use client";

import { Card } from "antd";
import Image from "next/image";

export function WelcomeCard() {
  return (
    <Card
      className="h-full border-none rounded-2xl shadow-duralux-card dark:shadow-duralux-card-dark transition-all duration-200 hover:shadow-duralux-hover dark:hover:shadow-duralux-hover-dark hover:-translate-y-0.5 overflow-hidden"
      bordered={false}
      styles={{ body: { padding: "0", height: "100%" } }}
    >
      <div className="relative h-full min-h-[180px] overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-duralux-primary via-duralux-primary-dark to-[#3f3ea8]" />

        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        {/* Content */}
        <div className="relative z-10 flex justify-between h-full p-6">
          <div className="flex flex-col justify-between max-w-[65%] text-white">
            <div className="space-y-3">
              <h5 className="text-xl font-bold m-0 drop-shadow-sm">
                Congratulations John!
              </h5>
              <p className="text-white/80 text-[0.9375rem] leading-relaxed m-0">
                You have done{" "}
                <span className="font-semibold text-white">72%</span> more
                sales today.
                <br />
                Check your new badge in your profile.
              </p>
            </div>

            <div className="mt-6">
              <button
                className="px-5 py-2.5 text-sm font-semibold rounded-xl
                  bg-white/20 text-white border border-white/30 cursor-pointer
                  hover:bg-white/30 hover:scale-105 hover:shadow-lg
                  backdrop-blur-sm transition-all duration-200"
              >
                View Badges
              </button>
            </div>
          </div>

          {/* Illustration */}
          <div className="absolute right-[-20px] bottom-[-20px] w-[200px] h-[180px]">
            <div className="relative w-full h-full">
              <Image
                src="/welcome-illustration.png"
                alt="Man with laptop"
                fill
                className="object-contain object-bottom pointer-events-none drop-shadow-xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
