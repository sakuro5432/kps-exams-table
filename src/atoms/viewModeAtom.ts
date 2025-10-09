"use client";

import { atomWithStorage } from "jotai/utils";

export type ViewMode = "CARD" | "TABLE";

/**
 * Global persistent view mode state
 * - Stored in localStorage (key: "viewMode")
 * - Default = "CARD" (mobile-first)
 */
export const viewModeAtom = atomWithStorage<ViewMode>("viewMode", "TABLE");
