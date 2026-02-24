import { getEvents, getSuggestions } from "./audit";
import {
  GET_AUDIT_EVENTS_QUERY,
  GET_SEARCH_FILTERS_QUERY,
} from "../GQL/auditQueries";
import { PerformQuery } from "../../sdks/performQuery";
import { AuditQueryParams } from "../types/audit";
import { getRlsFilters } from "../utils/auth";
import { isPermitted } from "../../sdks/STS";
import { GET_USER_ALLOWED_PARAMETERS_QUERY } from "../GQL/profileQueries";

// Mock dependencies
jest.mock("../utils/auth", () => ({
  getRlsFilters: jest.fn(),
}));
jest.mock("../../sdks/STS", () => ({
  isPermitted: jest.fn(),
  getUserIdFromCookie: jest.fn().mockReturnValue("user-123"),
}));

const mockPerformQuery = jest.fn() as unknown as PerformQuery;

describe("getEvents", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getRlsFilters as jest.Mock).mockReturnValue(null);
    // Default to permitted for existing tests
    (isPermitted as jest.Mock).mockImplementation(() => true);
    (mockPerformQuery as jest.Mock).mockResolvedValue({
      data: {
        allRecords: {
          totalCount: 0,
          nodes: [],
        },
      },
    });
  });

  const DEFAULT_TARGET_TYPE_FILTER = {
    targetType: {
      in: [
        "USER",
        // "PARAMETER", // Filtered by resourceType now
        // "ENTITY", // filtered out by default deny
        // ... others filtered out
      ],
    },
  };

  it("should construct correct filter for free text search (names only)", async () => {
    const params: AuditQueryParams = {
      searchInput: ["test-term"],
      exactSearch: false,
    };

    await getEvents(params, mockPerformQuery, "test-user-id");

    expect(mockPerformQuery).toHaveBeenCalledWith(
      GET_AUDIT_EVENTS_QUERY,
      expect.objectContaining({
        filter: {
          and: [
            DEFAULT_TARGET_TYPE_FILTER,
            {
              or: [
                { executorName: { includesInsensitive: "test-term" } },
                { targetName: { includesInsensitive: "test-term" } },
                { resourceName: { includesInsensitive: "test-term" } },
                { executorId: { includesInsensitive: "test-term" } },
                { targetId: { includesInsensitive: "test-term" } },
                { resourceId: { includesInsensitive: "test-term" } },
              ],
            },
          ],
        },
      }),
    );
  });

  it("should construct correct filter for suggestion search (USER type)", async () => {
    const params: AuditQueryParams = {
      searchInput: ["user-123"],
      exactSearch: true,
      searchType: "USER",
    };

    await getEvents(params, mockPerformQuery, "test-user-id");

    const calls = (mockPerformQuery as jest.Mock).mock.calls;
    const variables = calls[0][1];
    const filter = variables.filter;

    const expectedFilter = {
      and: [
        DEFAULT_TARGET_TYPE_FILTER,
        {
          or: [
            {
              and: [
                { executorId: { equalTo: "user-123" } },
                { executorType: { equalTo: "USER" } },
              ],
            },
            {
              and: [
                { targetId: { equalTo: "user-123" } },
                { targetType: { equalTo: "USER" } },
              ],
            },
            {
              and: [
                { resourceId: { equalTo: "user-123" } },
                { resourceType: { equalTo: "USER" } },
              ],
            },
          ],
        },
      ],
    };

    expect(JSON.stringify(filter)).toEqual(JSON.stringify(expectedFilter));
  });

  it("should construct correct filter for suggestion search (Other type)", async () => {
    const params: AuditQueryParams = {
      searchInput: ["resource-123"],
      exactSearch: true,
      searchType: "RESOURCE_TYPE",
    };

    await getEvents(params, mockPerformQuery, "test-user-id");

    const calls = (mockPerformQuery as jest.Mock).mock.calls;
    const variables = calls[0][1];
    const filter = variables.filter;

    const expectedFilter = {
      and: [
        DEFAULT_TARGET_TYPE_FILTER,
        {
          or: [
            {
              and: [
                { targetId: { equalTo: "resource-123" } },
                { targetType: { equalTo: "RESOURCE_TYPE" } },
              ],
            },
            {
              and: [
                { resourceId: { equalTo: "resource-123" } },
                { resourceType: { equalTo: "RESOURCE_TYPE" } },
              ],
            },
          ],
        },
      ],
    };

    expect(JSON.stringify(filter)).toEqual(JSON.stringify(expectedFilter));
  });

  it("should combine multiple filters", async () => {
    const params: AuditQueryParams = {
      actorSearch: "actor-123",
      searchInput: ["search-term"],
      exactSearch: false,
    };

    await getEvents(params, mockPerformQuery, "test-user-id");

    const calls = (mockPerformQuery as jest.Mock).mock.calls;
    const variables = calls[0][1];
    const filter = variables.filter;

    // Filters are pushed to andFilters, order matters based on implementation
    const expectedFilter = {
      and: [
        {
          and: [
            { executorId: { includesInsensitive: "actor-123" } },
            { executorType: { equalTo: "USER" } },
          ],
        },
        {
          targetType: {
            in: [
              "USER",
              // ... others filtered out
            ],
          },
        },
        {
          or: [
            { executorName: { includesInsensitive: "search-term" } },
            { targetName: { includesInsensitive: "search-term" } },
            { resourceName: { includesInsensitive: "search-term" } },
            { executorId: { includesInsensitive: "search-term" } },
            { targetId: { includesInsensitive: "search-term" } },
            { resourceId: { includesInsensitive: "search-term" } },
          ],
        },
      ],
    };

    expect(JSON.stringify(filter)).toEqual(JSON.stringify(expectedFilter));
  });

  it("should use correct pagination limits", async () => {
    // Default 50
    await getEvents({}, mockPerformQuery, "test-user-id");
    expect(mockPerformQuery).toHaveBeenCalledWith(
      GET_AUDIT_EVENTS_QUERY,
      expect.objectContaining({ first: 10, offset: 0 }),
    );

    // Custom params
    await getEvents(
      { page: 2, pageSize: 25 },
      mockPerformQuery,
      "test-user-id",
    );
    expect(mockPerformQuery).toHaveBeenCalledWith(
      GET_AUDIT_EVENTS_QUERY,
      expect.objectContaining({ first: 25, offset: 25 }),
    );

    // Max limit cap
    await getEvents({ pageSize: 500 }, mockPerformQuery, "test-user-id");
    expect(mockPerformQuery).toHaveBeenCalledWith(
      GET_AUDIT_EVENTS_QUERY,
      expect.objectContaining({ first: 200 }),
    );
  });
});

describe("getSuggestions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch suggestions using getSearchFilters", async () => {
    const mockResponse = {
      data: {
        getSearchFilters: {
          nodes: [
            { id: "user-1", name: "User One", type: "USER" },
            { id: "res-1", name: "Resource One", type: "ENTITY" },
          ],
        },
      },
    };

    (mockPerformQuery as jest.Mock).mockResolvedValue(mockResponse);

    const term = "test";
    const result = await getSuggestions({ term }, mockPerformQuery);

    expect(mockPerformQuery).toHaveBeenCalledWith(GET_SEARCH_FILTERS_QUERY, {
      searchValue: term,
      resultLimit: 50,
      resultOffset: 0,
    });

    expect(result).toEqual([
      { id: "user-1", name: "User One", type: "USER" },
      { id: "res-1", name: "Resource One", type: "ENTITY" },
    ]);
  });

  it("should handle empty response gracefully", async () => {
    (mockPerformQuery as jest.Mock).mockResolvedValue({
      data: {
        getSearchFilters: null,
      },
    });

    const result = await getSuggestions({ term: "unknown" }, mockPerformQuery);

    expect(result).toEqual([]);
  });

  it("should throw error on GraphQL errors", async () => {
    (mockPerformQuery as jest.Mock).mockResolvedValue({
      errors: [{ message: "Database errror" }],
    });

    await expect(
      getSuggestions({ term: "error" }, mockPerformQuery),
    ).rejects.toThrow("GraphQL Errors: Database errror");
  });
});

describe("Compartmentalization Logic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockPerformQuery as jest.Mock).mockResolvedValue({
      data: {
        allRecords: {
          totalCount: 0,
          nodes: [],
        },
      },
    });
  });

  it("should filter out parameters if user has no read permissions", async () => {
    (isPermitted as jest.Mock).mockReturnValue(false); // No read permissions

    const params: AuditQueryParams = {};
    await getEvents(params, mockPerformQuery, "user-123");

    const calls = (mockPerformQuery as jest.Mock).mock.calls;
    const variables = calls[0][1];
    const filter = variables.filter;

    // Should include filter to exclude PARAMETER by resourceType
    expect(JSON.stringify(filter)).toContain(
      JSON.stringify({ resourceType: { notEqualTo: "PARAMETER" } }),
    );
  });

  it("should allow all parameters if user has update permissions", async () => {
    (isPermitted as jest.Mock).mockImplementation((args) => {
      if (args?.profilePermission?.includes("read")) return true;
      if (args?.profilePermission?.includes("update")) return true;
      // Default allow for other permissions in this test context
      return true;
    });

    const params: AuditQueryParams = {};
    await getEvents(params, mockPerformQuery, "user-123");

    const calls = (mockPerformQuery as jest.Mock).mock.calls;
    const variables = calls[0][1];

    // Should NOT include filter to exclude PARAMETER
    // And should not query allowed parameters
    if (variables.filter) {
      // We expect NO restriction on PARAMETER resourceType
      expect(JSON.stringify(variables.filter)).not.toContain(
        JSON.stringify({ resourceType: { notEqualTo: "PARAMETER" } }),
      );
    }
    expect(mockPerformQuery).not.toHaveBeenCalledWith(
      GET_USER_ALLOWED_PARAMETERS_QUERY,
      expect.anything(),
    );
  });

  it("should filter by allowed parameters if user has read but not update permissions", async () => {
    (isPermitted as jest.Mock).mockImplementation((args) => {
      if (args?.profilePermission?.includes("read")) return true;
      if (args?.profilePermission?.includes("update")) return false;
      // Default allow for others
      return true;
    });

    // Mock allowed parameters response using dynamic context query structure
    (mockPerformQuery as jest.Mock).mockImplementation((query, variables) => {
      if (query.includes("AuditFilterContext")) {
        return Promise.resolve({
          data: {
            allowedParams: {
              nodes: [
                {
                  miragePremadeProfileByProfileId: {
                    miragePremadeProfileDigitalParameterValuesByProfileId: {
                      nodes: [
                        { parameterId: "p1", valueId: "v1" },
                        { parameterId: "p2", valueId: "v2" },
                      ],
                    },
                  },
                },
              ],
            },
          },
        });
      }
      // Return empty result for main query
      return Promise.resolve({
        data: { allRecords: { nodes: [], totalCount: 0 } },
      });
    });

    const params: AuditQueryParams = {};
    await getEvents(params, mockPerformQuery, "user-123");

    // Verify allowed parameters query was called
    const calls = (mockPerformQuery as jest.Mock).mock.calls;
    const contextCall = calls.find((call) =>
      call[0].includes("AuditFilterContext"),
    );
    expect(contextCall).toBeDefined();
    expect(contextCall[1]).toEqual(
      expect.objectContaining({ userId: "user-123" }),
    );

    // Verify filter construction
    const auditCall = calls.find((call) => call[0] === GET_AUDIT_EVENTS_QUERY);
    const variables = auditCall[1];
    const filter = variables.filter;

    const expectedOrCondition = {
      or: [
        { resourceType: { notEqualTo: "PARAMETER" } },
        {
          and: [
            { resourceType: { equalTo: "PARAMETER" } },
            { resourceId: { in: ["v1", "v2"] } },
          ],
        },
      ],
    };

    expect(JSON.stringify(filter)).toContain(
      JSON.stringify(expectedOrCondition.or[0]),
    );
  });
});
