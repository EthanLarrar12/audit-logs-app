import { getEvents } from "./audit";
import { GET_AUDIT_EVENTS_QUERY } from "../GQL/auditQueries";
import { PerformQuery } from "../../sdks/performQuery";
import { AuditQueryParams } from "../types/audit";
import { isPermitted } from "../../sdks/STS";
import { GraphQLFilter } from "../types/graphql";

// Mock dependencies

jest.mock("../../sdks/STS", () => ({
  isPermitted: jest.fn(),
  getUserIdFromCookie: jest.fn().mockReturnValue("user-123"),
}));

const mockPerformQuery = jest.fn() as unknown as PerformQuery;

describe("Category Compartmentalization", () => {
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

  it("should exclude USER category if mandatPermission read is missing", async () => {
    (isPermitted as jest.Mock).mockImplementation((params) => {
      // Check if permission check is for USER category
      if (params.mandatPermission && params.mandatPermission.includes("read")) {
        return false;
      }
      return false;
    });

    const params: AuditQueryParams = {};
    await getEvents(params, mockPerformQuery, "user-123");

    const calls = (mockPerformQuery as jest.Mock).mock.calls;
    // Find the call to GET_AUDIT_EVENTS_QUERY
    const auditCall = calls.find((call) => call[0] === GET_AUDIT_EVENTS_QUERY);
    const variables = auditCall[1];
    const filter = variables.filter;

    // Find the targetType filter
    const andFilters = filter.and;
    const targetTypeFilter = andFilters.find(
      (f: GraphQLFilter) => f.targetId && f.targetId.equalTo === "___NONE___",
    );

    expect(targetTypeFilter).toBeDefined();
  });

  it("should include USER category if mandatPermission read is present", async () => {
    (isPermitted as jest.Mock).mockReturnValue(true);

    const params: AuditQueryParams = {};
    await getEvents(params, mockPerformQuery, "user-123");

    const calls = (mockPerformQuery as jest.Mock).mock.calls;
    const auditCall = calls.find((call) => call[0] === GET_AUDIT_EVENTS_QUERY);
    const variables = auditCall[1];
    const filter = variables.filter;

    const andFilters = filter.and;
    const hasUserCategory = andFilters.some(
      (f: any) =>
        f.or &&
        f.or.some(
          (c: any) =>
            c.and && c.and.some((tf: any) => tf.targetType?.equalTo === "USER"),
        ),
    );

    expect(hasUserCategory).toBe(true);
  });

  it("should block specific category request if not permitted", async () => {
    (isPermitted as jest.Mock).mockImplementation((params) => {
      if (params.mandatPermission) return false;
      return true;
    });

    const params: AuditQueryParams = { category: ["USER"] };
    await getEvents(params, mockPerformQuery, "user-123");

    const calls = (mockPerformQuery as jest.Mock).mock.calls;
    const auditCall = calls.find((call) => call[0] === GET_AUDIT_EVENTS_QUERY);
    const variables = auditCall[1];
    const filter = variables.filter;

    const andFilters = filter.and;
    const noneFilter = andFilters.find(
      (f: GraphQLFilter) => f.targetId && f.targetId.equalTo === "___NONE___",
    );
    expect(noneFilter).toBeDefined();
  });

  it("should strictly filter by requested category if permitted", async () => {
    (isPermitted as jest.Mock).mockReturnValue(true);

    const params: AuditQueryParams = { category: ["USER"] };
    await getEvents(params, mockPerformQuery, "user-123");

    const calls = (mockPerformQuery as jest.Mock).mock.calls;
    const auditCall = calls.find((call) => call[0] === GET_AUDIT_EVENTS_QUERY);
    const variables = auditCall[1];
    const filter = variables.filter;

    const andFilters = filter.and;
    const hasUserCategory = andFilters.some(
      (f: any) =>
        f.or &&
        f.or.length === 1 &&
        f.or[0].and &&
        f.or[0].and.some((tf: any) => tf.targetType?.equalTo === "USER"),
    );

    expect(hasUserCategory).toBe(true);
  });

  it("should restrict search results to allowed categories (default deny applies)", async () => {
    // Only USER is allowed by default mapping
    (isPermitted as jest.Mock).mockReturnValue(true);

    const params: AuditQueryParams = {
      searchInput: ["some-entity"],
      exactSearch: false,
    };
    await getEvents(params, mockPerformQuery, "user-123");

    const calls = (mockPerformQuery as jest.Mock).mock.calls;
    const auditCall = calls.find((call) => call[0] === GET_AUDIT_EVENTS_QUERY);
    const variables = auditCall[1];
    const filter = variables.filter;

    // The filter should contain the default allowed list (which is only USER here)
    const andFilters = filter.and;

    const hasUserCategory = andFilters.some(
      (f: any) =>
        f.or &&
        f.or.some(
          (c: any) =>
            c.and && c.and.some((tf: any) => tf.targetType?.equalTo === "USER"),
        ),
    );

    expect(hasUserCategory).toBe(true);
  });
});
