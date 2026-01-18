# URL Filter Parameters

The audit logs application now supports URL-based filtering. You can set default filters by adding query parameters to the URL.

## Supported URL Parameters

### Category & Action
- `category` - Filter by category (e.g., `USER`, `CONTENT`)
- `action` - Filter by subcategory/action (e.g., `USER_SYNC`, `USER_LOGIN`)

### Search Fields
- `search` - General search input
- `actorUsername` - Filter by actor username
- `actorSearch` - Search in actor fields
- `targetSearch` - Search in target fields
- `resourceSearch` - Search in resource fields

### Date Range
- `dateFrom` - Start date (ISO 8601 format)
- `dateTo` - End date (ISO 8601 format)

## Example URLs

### Filter by category
```
http://localhost:5173/?category=USER
```

### Filter by category and action
```
http://localhost:5173/?category=USER&action=USER_SYNC
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

## Adding New Filters

The URL filter system is now **fully generic**. To add a new filter:

1. **Add the filter field to `AuditFilters` type** in `src/types/audit.ts`:
   ```typescript
   export interface AuditFilters {
     // ... existing fields
     myNewFilter?: string;
   }
   ```

2. **Update the mapping in `useUrlFilters.ts`**:
   ```typescript
   const filterToUrlMap: Record<keyof AuditFilters, string> = {
     // ... existing mappings
     myNewFilter: 'myNewFilter', // or use a different URL param name
   };
   ```

3. **If it's a date field**, add it to the `dateFields` set:
   ```typescript
   const dateFields: Set<keyof AuditFilters> = new Set([
     'dateFrom', 
     'dateTo',
     'myNewDateFilter', // add here
   ]);
   ```

That's it! The hook will automatically handle parsing from URL and syncing back.
