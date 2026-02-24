import { MirageObjectType } from "../../../types/mirage";
import { CategoryFilterHandler } from "./types";
import { UserFilterHandler } from "./userHandler";

export const categoryHandlers: Partial<
  Record<MirageObjectType, CategoryFilterHandler>
> = {
  [MirageObjectType.USER]: UserFilterHandler,
};

const defaultHandlerCache = new Map<MirageObjectType, CategoryFilterHandler>();

export const getCategoryHandler = (
  category: MirageObjectType,
): CategoryFilterHandler => {
  if (categoryHandlers[category]) {
    return categoryHandlers[category]!;
  }

  if (!defaultHandlerCache.has(category)) {
    defaultHandlerCache.set(category, {
      buildFilters: () => ({ targetType: { equalTo: category } }),
    });
  }

  return defaultHandlerCache.get(category)!;
};

export * from "./types";
