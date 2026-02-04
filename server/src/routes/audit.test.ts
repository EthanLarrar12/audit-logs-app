import request from "supertest";
import express from "express";
import { createAuditRouter } from "../routers/audit";
import * as auditBL from "../BLs/audit";
import { getPerformQuery } from "../../sdks/performQuery";

// Mock dependencies
jest.mock("../BLs/audit");
jest.mock("../../sdks/performQuery");

const mockPerformQuery = jest.fn();
(getPerformQuery as jest.Mock).mockResolvedValue(mockPerformQuery);

const app = express();
app.use(express.json());
// Mock middleware for API key if needed, or mount router directly
// Since the router applies validation, we can test that.
// But we might need to mock the API key middleware if it's applied in router
// Let's check routers/audit.ts again. It uses getApiKeyValidationMiddleware.
// We should probably mock that too or bypass it for testing logic.
// The router function takes `performQuery`.

const router = createAuditRouter(mockPerformQuery);
app.use("/audit", router);

describe("DELETE /audit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delete history when valid dates are provided", async () => {
    const deletedCount = 100;
    (auditBL.deleteAuditHistory as jest.Mock).mockResolvedValue(deletedCount);

    const startDate = 1706954400000;
    const endDate = 1707040800000;

    const response = await request(app)
      .delete("/audit")
      .send({ startDate, endDate });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: `Deleted ${deletedCount} records`,
      deletedCount,
    });
    expect(auditBL.deleteAuditHistory).toHaveBeenCalledWith(
      mockPerformQuery,
      startDate,
      endDate,
    );
  });

  it("should return validation error if dates are missing", async () => {
    const response = await request(app).delete("/audit").send({});

    expect(response.status).toBe(400); // Validation error
  });

  it("should return validation error if dates are invalid types", async () => {
    const response = await request(app).delete("/audit").send({
      startDate: "invalid-date",
      endDate: "invalid-date",
    });

    expect(response.status).toBe(400);
  });

  it("should handle server errors gracefully", async () => {
    const errorMessage = "Database error";
    (auditBL.deleteAuditHistory as jest.Mock).mockRejectedValue(
      new Error(errorMessage),
    );

    const startDate = 1706954400000;
    const response = await request(app).delete("/audit").send({ startDate });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: "Internal server error",
      details: errorMessage,
    });
  });
});
