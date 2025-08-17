import type { User } from "./types";

export const saveUserToLocalStorage = (value: string | User) => {
  try {
    if (typeof value === "string") {
      // Assume it's the token
      localStorage.setItem("token", value);
    } else if (typeof value === "object") {
      // Assume it's the user object
      localStorage.setItem("user", JSON.stringify(value));
    }
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
};
export const getValueFromLocalStorage = <T = unknown>(
  key: string
): T | string | null => {
  try {
    const storedValue = localStorage.getItem(key);
    if (!storedValue) return null;

    // checking if its token then dontt ned parsing
    if (
      storedValue.trim().startsWith("{") ||
      storedValue.trim().startsWith("[")
    ) {
      return JSON.parse(storedValue) as T;
    }

    return storedValue; // likely a token or plain string
  } catch (error) {
    console.error(`Error getting key "${key}" from localStorage:`, error);
    return null;
  }
};
