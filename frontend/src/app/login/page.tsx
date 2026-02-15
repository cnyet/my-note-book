"use client";

import { LoginForm } from "@/components/admin/LoginForm";
import { ParticleBg } from "@/components/v-ui/ParticleBg";
import { useAdminAuth } from "@/lib/hooks/useAdminAuth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

function LoginContent() {
  const { isAuthenticated, loading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, loading, router]);

  if (loading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Redirecting...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-0">
        <ParticleBg />
      </div>

      <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
        <div className="max-w-md w-full">
          {/* Card */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/20 p-8 animate-in fade-in zoom-in-50 duration-500">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <Image
                  src="/logo.svg"
                  alt="Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 font-heading">
                Welcome Back
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Sign in to MyNoteBook Admin
              </p>
            </div>

            {/* Login Form */}
            <LoginForm />

            {/* Register Link (Optional / Placeholder) */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="#"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                  onClick={(e) => e.preventDefault()}
                >
                  Contact Administrator
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-500">
            © {new Date().getFullYear()} MyNoteBook. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Loading...
            </p>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
