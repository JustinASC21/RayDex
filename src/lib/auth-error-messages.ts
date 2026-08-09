export type AuthErrorCode =
  | "INVALID_EMAIL_OR_PASSWORD"
  | "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL"
  | "EMAIL_PASSWORD_SIGN_UP_DISABLED"
  | "EMAIL_PASSWORD_DISABLED"
  | string;

const errorMessages: Record<string, { title: string; description: string; hint: string }> = {
  INVALID_EMAIL_OR_PASSWORD: {
    title: "Incorrect email or password",
    description: "We could not find a matching account with those credentials.",
    hint: "Double-check your email address and password, then try again.",
  },
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: {
    title: "Account already exists",
    description: "That email is already registered in RayDex.",
    hint: "Sign in with that email instead, or use a different address for a new account.",
  },
  EMAIL_PASSWORD_SIGN_UP_DISABLED: {
    title: "Sign up is disabled",
    description: "Email and password account creation is not enabled right now.",
    hint: "If this should be available, check the auth config and try again later.",
  },
  EMAIL_PASSWORD_DISABLED: {
    title: "Sign in is disabled",
    description: "Email and password authentication is not enabled right now.",
    hint: "If this should be available, check the auth config and try again later.",
  },
};

export function getAuthErrorMessage(code?: string | null) {
  return errorMessages[code ?? ""] ?? {
    title: "Authentication failed",
    description: "Something went wrong while processing your request.",
    hint: "Please try again.",
  };
}
