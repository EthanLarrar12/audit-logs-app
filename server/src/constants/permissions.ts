import { Permissions } from "../../sdks/STS";
import { MirageObjectType } from "../types/mirage";

// Define permissions for each category
// Default behavior is DENY if not listed here
export const CATEGORY_PERMISSIONS: Partial<
  Record<MirageObjectType, Permissions>
> = {
  [MirageObjectType.USER]: { mandatPermissions: ["read"] },
  [MirageObjectType.SHOS]: { mandatPermissions: ["read"] },
  [MirageObjectType.DYNAMIC_TAG]: { mandatPermissions: ["read"] },
  [MirageObjectType.DISTRIBUTION_GROUP]: { mandatPermissions: ["read"] },
  [MirageObjectType.PROFILE]: { mandatPermissions: ["read"] },
  [MirageObjectType.END_SYSTEM]: { mandatPermissions: ["read"] },
  [MirageObjectType.PARAMETER]: { mandatPermissions: ["read"] },
  // Add other mappings here as needed.
};
