import { unitsConfig } from "@/src/config/paradise-collection.config";
import type { UnitConfig, UnitSlug } from "@/src/types";

/** All units – sourced from paradise-collection.config.ts. Edit the config, not this file. */
export const units: UnitConfig[] = unitsConfig;

export function getUnitBySlug(slug: string): UnitConfig | undefined {
  return units.find((unit) => unit.slug === slug);
}

export function isUnitSlug(slug: string): slug is UnitSlug {
  return units.some((unit) => unit.slug === slug);
}
