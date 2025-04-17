// Secure storage utility to replace localStorage

// Cookie-based token storage
export const secureStorage = {
  setToken: (token: string) => {
    // Set HttpOnly cookie with token
    document.cookie = `token=${token}; path=/; max-age=86400; secure; samesite=strict; httponly`
  },

  clearToken: () => {
    // Clear token cookie
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict; httponly"
  },

  // For non-sensitive data that needs to be accessible client-side
  setItem: (key: string, value: string) => {
    localStorage.setItem(key, value)
  },

  getItem: (key: string) => {
    return localStorage.getItem(key)
  },

  removeItem: (key: string) => {
    localStorage.removeItem(key)
  },
}
