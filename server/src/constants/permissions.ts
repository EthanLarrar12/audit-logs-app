import { Permissions } from "../../sdks/STS";
import { MirageObjectType } from "../types/mirage";

// Define permissions for each category
// Default behavior is DENY if not listed here
export const CATEGORY_PERMISSIONS: Partial<
  Record<MirageObjectType, Permissions>
> = {
  [MirageObjectType.USER]: { mandatPermission: ["read"] },
  // [MirageObjectType.SHOS]: { mandatPermission: ["read"] },
  // [MirageObjectType.DYNAMIC_TAG]: { mandatPermission: ["read"] },
  // [MirageObjectType.DISTRIBUTION_GROUP]: { mandatPermission: ["read"] },
  // [MirageObjectType.PROFILE]: { mandatPermission: ["read"] },
  // [MirageObjectType.END_SYSTEM]: { mandatPermission: ["read"] },
  // [MirageObjectType.PARAMETER]: { mandatPermission: ["read"] },
  // Add other mappings here as needed.
};
