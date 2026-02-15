"use client";

import { NeonButton } from "@/components/v-ui/NeonButton";
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
          <div className="space-y-4">
            <h2 className="text-xl font-semibold m-0 text-[#696cff]">
              Congratulations John! 🎉
            </h2>
            <p className="text-[#8592a3] text-sm leading-relaxed m-0">
              You have done{" "}
              <span className="font-semibold text-[#71dd37]">72%</span> more
              sales today. Check your new badge in your profile.
            </p>
          </div>

          <div className="mt-6">
            <NeonButton variant="outline" size="sm">
              VIEW BADGES
            </NeonButton>
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
