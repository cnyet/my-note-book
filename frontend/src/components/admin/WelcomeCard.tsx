"use client";

import { Card } from "antd";
import Image from "next/image";

export function WelcomeCard() {
  return (
    <Card
      className="h-full border-none sneat-card-shadow overflow-hidden bg-white dark:bg-[#2b2c40]"
      bordered={false}
      styles={{ body: { padding: "1.5rem", height: "100%" } }}
    >
      <div className="flex justify-between h-full relative z-10">
        <div className="flex flex-col justify-between max-w-[65%]">
          <div className="space-y-3">
            <h5 className="text-xl font-semibold m-0 text-[#696cff]">
              Congratulations John! 🎉
            </h5>
            <p className="text-[#697a8d] text-[0.9375rem] leading-relaxed m-0">
              You have done{" "}
              <span className="font-semibold text-[#696cff]">72%</span> more
              sales today.
              <br />
              Check your new badge in your profile.
            </p>
          </div>

          <div className="mt-6">
            <button
              className="px-5 py-2 text-sm font-medium rounded-md
                bg-[#696cff]/10 text-[#696cff] border-none cursor-pointer
                hover:bg-[#696cff] hover:text-white
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
