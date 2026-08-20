import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    (typeof window !== "undefined" ? window.location.origin : undefined),
  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
          defaultValue: "seeker",
        },
        companyName: {
          type: "string",
        },
      },
    }),
  ],
});

export const { signIn, signUp, signOut, useSession, updateUser } = authClient;