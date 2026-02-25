"use client";

import { Button } from "@/components/ui/button";
import { adminAuthApi } from "@/lib/admin-api";
import { setAdminUser, setAuthToken } from "@/lib/admin-auth";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Eye, EyeOff, Loader2, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<
    "username" | "password" | null
  >(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await adminAuthApi.login(username, password);

      if (!response.success) {
        throw new Error(response.error || "Login failed");
      }

      const { access_token } = response.data!;
      setAuthToken(access_token);

      const userResponse = await adminAuthApi.verify();
      if (userResponse.success) {
        setAdminUser(userResponse.data!);
        toast.success("Welcome back!", {
          description: `Logged in as ${userResponse.data!.username}`,
        });

        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/admin");
        }
      } else {
        throw new Error("Verification failed after login");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Login failed, please try again";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const isValidUsername = username.length > 0;

  // 提取基础 class 名，避免重复渲染时重新计算
  const usernameInputClasses = cn(
    "w-full pl-12 pr-12 py-3 border-2 rounded-xl transition-all duration-200 outline-none",
    "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100",
  );

  const passwordInputClasses = cn(
    "w-full pl-12 pr-12 py-3 border-2 rounded-xl transition-all duration-200 outline-none",
    "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100",
  );

  const iconBaseClasses = "absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Username Field */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-2"
      >
        <label
          htmlFor="username"
          className="text-sm font-medium text-slate-700 dark:text-slate-300 block"
        >
          Username
        </label>
        <div className="relative group">
          <User
            className={cn(
              iconBaseClasses,
              focusedField === "username" ? "text-primary" : "text-slate-400"
            )}
          />
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onFocus={() => setFocusedField("username")}
            onBlur={() => setFocusedField(null)}
            required
            autoComplete="username"
            className={cn(
              usernameInputClasses,
              focusedField === "username"
                ? "border-primary shadow-lg shadow-primary/20"
                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
            )}
            placeholder="admin"
            disabled={isLoading}
          />
          <AnimatePresence>
            {isValidUsername && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Password Field */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-2"
      >
        <label
          htmlFor="password"
          className="text-sm font-medium text-slate-700 dark:text-slate-300 block"
        >
          Password
        </label>
        <div className="relative group">
          <Lock
            className={cn(
              iconBaseClasses,
              focusedField === "password" ? "text-primary" : "text-slate-400"
            )}
          />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField(null)}
            required
            autoComplete="current-password"
            className={cn(
              passwordInputClasses,
              focusedField === "password"
                ? "border-primary shadow-lg shadow-primary/20"
                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
            )}
            placeholder="••••••••"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
      </motion.div>

      {/* Remember Me & Forgot Password */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="flex items-center justify-between"
      >
        <label className="flex items-center cursor-pointer group">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="sr-only"
            disabled={isLoading}
          />
          <div
            className={cn(
              "relative w-5 h-5 border-2 rounded-md transition-all duration-200",
              rememberMe ? "bg-primary border-primary" : "border-slate-300 dark:border-slate-600 group-hover:border-primary/70"
            )}
          >
            {rememberMe && (
              <CheckCircle2 className="absolute inset-0 h-5 w-5 text-white m-auto" />
            )}
          </div>
          <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
            Remember me
          </span>
        </label>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            toast.info("Contact system administrator to reset password.");
          }}
          className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
        >
          Forgot password?
        </a>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800"
          >
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">
              {error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Button
          type="submit"
          className="w-full h-12 bg-gradient-neon hover:opacity-90 text-white font-medium shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <CheckCircle2 className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </motion.div>
    </form>
  );
}
