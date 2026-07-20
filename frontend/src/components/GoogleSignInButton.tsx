"use client";

import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";
import { apiErrorMessage } from "@/lib/api";

const clientIdConfigured = Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

interface Props {
  onError: (message: string) => void;
  onStart?: () => void;
  onDone?: () => void;
  onSuccess?: () => void;
}

export default function GoogleSignInButton({ onError, onStart, onDone, onSuccess }: Props) {
  const { googleLogin } = useAuth();

  if (!clientIdConfigured) {
    return (
      <button
        type="button"
        disabled
        title="Set NEXT_PUBLIC_GOOGLE_CLIENT_ID in .env.local to enable Google sign-in"
        className="w-full cursor-not-allowed rounded-full border border-navy/20 px-4 py-2.5 text-sm font-medium text-navy/40"
      >
        Continue with Google (not configured)
      </button>
    );
  }

  async function handleSuccess(credentialResponse: CredentialResponse) {
    if (!credentialResponse.credential) {
      onError("Google didn't return a credential. Please try again.");
      return;
    }
    onStart?.();
    try {
      await googleLogin(credentialResponse.credential);
      onSuccess?.();
    } catch (err) {
      onError(apiErrorMessage(err));
    } finally {
      onDone?.();
    }
  }

  return (
    <div className="flex justify-center [&>div]:!w-full">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => onError("Google sign-in failed. Please try again.")}
        theme="outline"
        shape="pill"
        width="100%"
        text="continue_with"
      />
    </div>
  );
}
