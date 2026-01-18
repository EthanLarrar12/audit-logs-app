# URL Filter Parameters

The audit logs application now supports URL-based filtering. You can set default filters by adding query parameters to the URL.

## Supported URL Parameters

### Category & Action (Multi-select)
- `category` - Filter by one or more categories, comma-separated (e.g., `USER`, `USER,ENTITY`)
- `action` - Filter by one or more subcategories/actions, comma-separated (e.g., `USER_SYNC`, `USER_SYNC,ENTITY_CREATION`)

### Search Fields
- `search` - General search input
- `actorUsername` - Filter by actor username
- `actorSearch` - Search in actor fields
- `targetSearch` - Search in target fields
- `resourceSearch` - Search in resource fields
- `premadeProfile` - Filter by a premade profile ID (links to a specific set of parameters)

### Date Range
- `dateFrom` - Start date (ISO 8601 format)
- `dateTo` - End date (ISO 8601 format)

## Example URLs

### Filter by multiple categories
```
http://localhost:5173/?category=USER,ENTITY
```

### Filter by multiple categories and actions
```
http://localhost:5173/?category=USER,ENTITY&action=USER_SYNC,ENTITY_CREATION
```

### Filter by premade profile
```
http://localhost:5173/?premadeProfile=123e4567-e89b-12d3-a456-426614174000
```

### Filter by date range
```
http://localhost:5173/?dateFrom=2026-01-01T00:00:00.000Z&dateTo=2026-01-18T23:59:59.999Z
```

### Filter by username
```
http://localhost:5173/?actorSearch=jane.doe
```

### Combined filters
```
http://localhost:5173/?category=USER&action=USER_SYNC&dateFrom=2026-01-01T00:00:00.000Z&actorSearch=jane.doe
```

## Features

- **Deep Linking**: Share filtered views by copying the URL
- **Bookmarks**: Save commonly used filter combinations
- **Auto-sync**: Filters automatically update the URL as you change them
- **Reset**: Clicking "Reset" clears all filters and the URL parameters
- **Multi-select Support**: Most dropdowns support choosing multiple values simultaneously

## Adding New Filters

The URL filter system is now **fully generic**. To add a new filter:

1. **Add the filter field to `AuditFilters` type** in `src/types/audit.ts`:
   ```typescript
   export interface AuditFilters {
     // ... existing fields
     myNewFilter?: string | string[];
   }
   ```

2. **Update the mapping in `useUrlFilters.ts`**:
   ```typescript
   const filterToUrlMap: Record<keyof AuditFilters, string> = {
     // ... existing mappings
     myNewFilter: 'myNewFilter', // or use a different URL param name
   };
   ```

3. **Handle complex types** by adding them to the appropriate set:
   - **Date fields**: Add to `dateFields` set.
   - **Array fields**: Add to `arrayFields` set (will be comma-separated in URL).

   ```typescript
   const dateFields: Set<keyof AuditFilters> = new Set(['dateFrom', 'dateTo', 'myDateField']);
   const arrayFields: Set<keyof AuditFilters> = new Set(['category', 'action', 'myArrayField']);
   ```

That's it! The hook will automatically handle parsing from URL and syncing back.

