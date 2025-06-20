// Simple getEnv function for accessing environment variables in a unified way
// Usage: getEnv().apiUrl, getEnv().baseUrl, getEnv().authUrl, getEnv().authSecret

export function getEnv() {
  return {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    authUrl: process.env.NEXTAUTH_URL,
    authSecret: process.env.NEXTAUTH_SECRET,
  };
}
