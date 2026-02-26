"use client";

import { Card } from "antd";
import Image from "next/image";

export function WelcomeCard() {
  return (
    <Card
      className="h-full border-none rounded-xl shadow-[0_2px_6px_rgba(67,89,113,0.12)] transition-all duration-200 hover:shadow-[0_4px_12px_rgba(67,89,113,0.2)] overflow-hidden bg-white"
      bordered={false}
      styles={{ body: { padding: "1.5rem", height: "100%" } }}
    >
      <div className="flex justify-between h-full relative z-10">
        <div className="flex flex-col justify-between max-w-[65%]">
          <div className="space-y-3">
            <h5 className="text-xl font-semibold m-0 text-[#32325d]">
              Congratulations John!
            </h5>
            <p className="text-[#525f7f] text-[0.9375rem] leading-relaxed m-0">
              You have done{" "}
              <span className="font-semibold text-[#32325d]">72%</span> more
              sales today.
              <br />
              Check your new badge in your profile.
            </p>
          </div>

          <div className="mt-6">
            <button
              className="px-5 py-2 text-sm font-medium rounded-md
                bg-[#32325d]/10 text-[#32325d] border-none cursor-pointer
                hover:bg-[#32325d] hover:text-white
                transition-all duration-200"
            >
              View Badges
            </button>
          </div>
        </div>

        {/* Illustration */}
        <div className="absolute right-0 bottom-[-10px] w-[180px] h-[160px]">
          <div className="relative w-full h-full">
            <Image
              src="/welcome-illustration.png"
              alt="Man with laptop"
              fill
              className="object-contain object-bottom pointer-events-none"
              priority
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
