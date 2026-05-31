// Define type Credentials
type Credentials = {
  email: string;
  password: string;
  role?: string;          // ? means optional — can be there or not
};

// Create a user object using this type
export const validUser: Credentials = {
  email: 'user@example.com',
  password: 'secret123',
  // role is optional, so we can skip it
};

// Function that builds login URL from environment name
export function getLoginUrl(env: string): string {
  return `https://${env}.example.com/login`;
}

// Quick check
console.log(validUser);
console.log(getLoginUrl('staging'));
console.log(getLoginUrl('prod'));