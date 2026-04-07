const AUTH_STORAGE_KEY = "redclass-auth";

export function loadAuthStorage() {
  try {
    const rawValue = localStorage.getItem(AUTH_STORAGE_KEY);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch (error) {
    console.error("Failed to load auth storage:", error);
    return null;
  }
}

export function saveAuthStorage(value) {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(value));
  } catch (error) {
    console.error("Failed to save auth storage:", error);
  }
}

export function clearAuthStorage() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear auth storage:", error);
  }
}
