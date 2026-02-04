import request from "supertest";
import express from "express";
import { createAuditRouter } from "../routers/audit";
import { getPerformQuery } from "../../sdks/performQuery";
import { DELETE_AUDIT_HISTORY_MUTATION } from "../GQL/auditQueries";

// Mock ONLY performQuery, use real BL
jest.mock("../../sdks/performQuery");

const mockPerformQuery = jest.fn();
(getPerformQuery as jest.Mock).mockResolvedValue(mockPerformQuery);

const app = express();
app.use(express.json());

// Initialize router with mocked performQuery
const router = createAuditRouter(mockPerformQuery);
app.use("/audit", router);

describe("DELETE /audit Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should generate correct SQL parameters for delete history", async () => {
    // Setup mock response for performQuery
    mockPerformQuery.mockResolvedValue({
      data: {
        deleteAuditHistory: {
          integer: 42,
        },
      },
    });

    const startDate = 1706954400000;
    const endDate = 1707040800000;

    const response = await request(app)
      .delete("/audit")
      .send({ startDate, endDate });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "Deleted 42 records",
      deletedCount: 42,
    });

    // Verify performQuery was called with correct mutation and variables
    expect(mockPerformQuery).toHaveBeenCalledWith(
      DELETE_AUDIT_HISTORY_MUTATION,
      {
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      },
    );
  });

  it("should flow 6 months ago date correctly to SQL", async () => {
    mockPerformQuery.mockResolvedValue({
      data: {
        deleteAuditHistory: {
          integer: 10,
        },
      },
    });

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // We send timestamps
    const startDate: number = sixMonthsAgo.getTime();
    const endDate: number = new Date().getTime();

    await request(app).delete("/audit").send({ startDate, endDate });

    expect(mockPerformQuery).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        startDate: sixMonthsAgo.toISOString(),
        endDate: new Date(endDate).toISOString(),
      }),
    );
  });
});
