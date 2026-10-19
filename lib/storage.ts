import { FinanceState } from "../types";

const LEGACY_KEY = "finwise_state_v1";
const keyForUser = (userId: string) => `finwise_state_v1_${userId}`;

export const saveState = (userId: string, state: FinanceState): boolean => {
  try {
    if (typeof window === "undefined") return false;
    window.localStorage.setItem(keyForUser(userId), JSON.stringify(state));
    return true;
  } catch (error) {
    console.warn("Failed to save FinWise data:", error);
    return false;
  }
};

export const loadState = (userId: string): FinanceState | null => {
  try {
    if (typeof window === "undefined") return null;

    let raw = window.localStorage.getItem(keyForUser(userId));

    // One-time migration from the old single-user storage.
    if (!raw) {
      const legacy = window.localStorage.getItem(LEGACY_KEY);
      if (legacy) {
        raw = legacy;
        window.localStorage.setItem(keyForUser(userId), legacy);
        window.localStorage.removeItem(LEGACY_KEY);
      }
    }

    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return null;
    }

    return parsed as FinanceState;
  } catch (error) {
    console.warn("Failed to load FinWise data:", error);
    return null;
  }
};

export const removeSavedState = (userId: string): boolean => {
  try {
    if (typeof window === "undefined") return false;
    window.localStorage.removeItem(keyForUser(userId));
    return true;
  } catch (error) {
    console.warn("Failed to remove saved FinWise data:", error);
    return false;
  }
};
