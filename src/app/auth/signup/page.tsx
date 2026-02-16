"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { signIn } from "next-auth/react";
import { signUpAction, type AuthActionState } from "../actions";
import { UserPlus, KeyRound } from "lucide-react";

const initialState: AuthActionState = {};

export default function SignUpPage() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(signUpAction, initialState);

  useEffect(() => {
    if (state.success) {
      router.push("/auth/signin");
    }
  }, [state.success, router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-accent">
            <span className="text-3xl">&#9971;</span>
            JMC Charities
          </Link>
        </div>

        <div className="bg-card-bg border border-card-border rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-accent/10 rounded-lg">
              <UserPlus className="text-accent" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
          </div>

          {state.error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {state.error}
            </div>
          )}

          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 py-2.5 border border-card-border rounded-lg font-medium text-foreground hover:bg-muted-bg transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-card-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card-bg px-3 text-muted">or create account with email</span>
            </div>
          </div>

          <form action={formAction} className="space-y-4">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <label htmlFor="accessCode" className="flex items-center gap-2 text-sm font-medium text-amber-800 mb-1.5">
                <KeyRound size={14} />
                Access Code
              </label>
              <input
                id="accessCode"
                name="accessCode"
                type="text"
                required
                className="w-full px-4 py-2.5 border border-amber-300 rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors"
                placeholder="Enter your invite code"
              />
              <p className="mt-1 text-xs text-amber-600">Enter the event code from your invitation, or a team invite code from a captain</p>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-foreground mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                minLength={3}
                className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors"
                placeholder="johndoe42"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                className="w-full px-4 py-2.5 border border-card-border rounded-lg bg-white text-foreground focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors"
                placeholder="Min 8 characters"
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors disabled:opacity-50"
            >
              {pending ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-accent font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
