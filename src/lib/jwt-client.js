/**
 * HireLoop JWT Client Helper Utility
 * Synchronizes client authentication state with the Express backend server (port 5000).
 */

const SERVER_API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
const TOKEN_KEY = "hireloop_jwt_token";

/**
 * Sync user session with Express server to generate/retrieve a valid JWT token
 * @param {Object} user - User object from Better Auth session
 */
export async function syncJWTToken(user) {
  if (!user || !user.email) return null;

  try {
    const res = await fetch(`${SERVER_API_URL}/api/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        userId: user.id || user._id,
        email: user.email,
        name: user.name,
        role: user.role || "seeker",
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (typeof window !== "undefined" && data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
      }
      return data.token;
    }
  } catch (err) {
    console.warn("JWT sync with backend server failed (server might be offline):", err);
  }
  return null;
}

/**
 * Get stored JWT token from client storage
 */
export function getJWTToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

/**
 * Clear JWT token and call backend logout
 */
export async function clearJWTToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
  try {
    await fetch(`${SERVER_API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (e) {
    // Ignore network error on logout
  }
}

/**
 * Authenticated Fetch wrapper for Express server endpoints
 * Automatically adds Authorization Bearer header & sends credentials
 */
export async function fetchWithAuth(url, options = {}) {
  const token = getJWTToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const fullUrl = url.startsWith("http") ? url : `${SERVER_API_URL}${url}`;

  return fetch(fullUrl, {
    ...options,
    headers,
    credentials: "include",
  });
}
