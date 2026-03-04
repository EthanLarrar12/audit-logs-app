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

  it("should show only self-events when all category permissions are denied", async () => {
    (isPermitted as jest.Mock).mockReturnValue(false);

    const params: AuditQueryParams = {};
    await getEvents(params, mockPerformQuery, "user-123");

    const calls = (mockPerformQuery as jest.Mock).mock.calls;
    const auditCall = calls.find((call) => call[0] === GET_AUDIT_EVENTS_QUERY);
    const variables = auditCall[1];
    const filter = variables.filter;

    const andFilters = filter.and;

    // Should NOT fall back to the ___NONE___ sentinel
    const noneFilter = andFilters.find(
      (f: GraphQLFilter) => f.targetId && f.targetId.equalTo === "___NONE___",
    );
    expect(noneFilter).toBeUndefined();

    // Should instead contain the self-event OR arm: { or: [{ executorId }, { targetId }, { resourceId }] }
    const selfEventFilter = andFilters.find(
      (f: any) =>
        f.or &&
        f.or.some((arm: any) => arm.executorId?.equalTo === "user-123") &&
        f.or.some((arm: any) => arm.targetId?.equalTo === "user-123") &&
        f.or.some((arm: any) => arm.resourceId?.equalTo === "user-123"),
    );
    expect(selfEventFilter).toBeDefined();
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

  it("should show only self-events when specific denied category is requested", async () => {
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

    // Should NOT fall back to the ___NONE___ sentinel
    const noneFilter = andFilters.find(
      (f: GraphQLFilter) => f.targetId && f.targetId.equalTo === "___NONE___",
    );
    expect(noneFilter).toBeUndefined();

    // Should instead be the bare self-event filter: { or: [{ executorId }, { targetId }, { resourceId }] }
    const selfEventFilter = andFilters.find(
      (f: any) =>
        f.or &&
        f.or.some((arm: any) => arm.executorId?.equalTo === "user-123") &&
        f.or.some((arm: any) => arm.targetId?.equalTo === "user-123") &&
        f.or.some((arm: any) => arm.resourceId?.equalTo === "user-123"),
    );
    expect(selfEventFilter).toBeDefined();
  });

  it("should strictly filter by requested category if permitted, alongside self-event arm", async () => {
    (isPermitted as jest.Mock).mockReturnValue(true);

    const params: AuditQueryParams = { category: ["USER"] };
    await getEvents(params, mockPerformQuery, "user-123");

    const calls = (mockPerformQuery as jest.Mock).mock.calls;
    const auditCall = calls.find((call) => call[0] === GET_AUDIT_EVENTS_QUERY);
    const variables = auditCall[1];
    const filter = variables.filter;

    const andFilters = filter.and;

    // The OR block must contain the USER category arm
    const hasUserCategory = andFilters.some(
      (f: any) =>
        f.or &&
        f.or.some(
          (c: any) =>
            c.and && c.and.some((tf: any) => tf.targetType?.equalTo === "USER"),
        ),
    );
    expect(hasUserCategory).toBe(true);

    // The OR block must also contain the self-event arm ({ or: [{executorId}, {targetId}, {resourceId}] })
    const hasSelfEventArm = andFilters.some(
      (f: any) =>
        f.or &&
        f.or.some(
          (arm: any) =>
            arm.or &&
            arm.or.some(
              (inner: any) => inner.executorId?.equalTo === "user-123",
            ),
        ),
    );
    expect(hasSelfEventArm).toBe(true);
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
  it("should OR self-event arm alongside category filters when at least one category is permitted", async () => {
    (isPermitted as jest.Mock).mockReturnValue(true);

    const params: AuditQueryParams = {};
    await getEvents(params, mockPerformQuery, "user-123");

    const calls = (mockPerformQuery as jest.Mock).mock.calls;
    const auditCall = calls.find((call) => call[0] === GET_AUDIT_EVENTS_QUERY);
    const filter = auditCall[1].filter;
    const andFilters = filter.and;

    // Find the OR block that covers both category AND self-event
    const orBlock = andFilters.find(
      (f: any) =>
        f.or &&
        // has a category arm
        f.or.some(
          (c: any) =>
            c.and && c.and.some((tf: any) => tf.targetType?.equalTo === "USER"),
        ) &&
        // also has the self-event arm ({ or: [{executorId}, ...] })
        f.or.some(
          (arm: any) =>
            arm.or &&
            arm.or.some(
              (inner: any) => inner.executorId?.equalTo === "user-123",
            ),
        ),
    );
    expect(orBlock).toBeDefined();
  });

  it("should still AND global filters on top of the self-event OR block", async () => {
    (isPermitted as jest.Mock).mockReturnValue(true);

    const params: AuditQueryParams = {
      from: "2024-01-01T00:00:00.000Z",
      to: "2024-12-31T23:59:59.999Z",
    };
    await getEvents(params, mockPerformQuery, "user-123");

    const calls = (mockPerformQuery as jest.Mock).mock.calls;
    const auditCall = calls.find((call) => call[0] === GET_AUDIT_EVENTS_QUERY);
    const filter = auditCall[1].filter;
    const andFilters = filter.and;

    // The AND block must contain both the OR block (self-event + category)
    const hasOrBlock = andFilters.some((f: any) => f.or);
    expect(hasOrBlock).toBe(true);

    // AND a date range filter
    const hasDateFilter = andFilters.some(
      (f: any) => f.insertTime || f.and?.some?.((df: any) => df.insertTime),
    );
    expect(hasDateFilter).toBe(true);
  });
});
