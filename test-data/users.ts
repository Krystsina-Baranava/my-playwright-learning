// ===================== TEST DATA: users =====================
// Central place for credentials and login-related helpers.

// Define type Credentials
export type Credentials = {
  email: string;
  password: string;
  role?: string; // ? means optional — can be there or not
};

// Example user object using this type
export const validUser: Credentials = {
  email: "user@example.com",
  password: "secret123",
  // role is optional, so we can skip it
};

// Function that builds a login URL from an environment name
export function getLoginUrl(env: string): string {
  return `https://${env}.example.com/login`;
}

// ----- SauceDemo credentials (used by the e2e specs) -----
export const PASSWORD = "secret_sauce";

export const users = {
  standard: { username: "standard_user", password: PASSWORD },
  locked: { username: "locked_out_user", password: PASSWORD },
} as const;

export const wrongPassword = "wrong_password";
