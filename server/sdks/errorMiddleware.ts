import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { ApiException } from "./exceptions";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ApiException) {
    res.status(err.httpStatusCode).json({
      errorMessage: err.errorMessage,
      extraDetails: err.extraDetails,
    });
    return;
  }

  console.error("Unknown Error:", err);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    errorMessage: "Internal Server Error",
    extraDetails: "",
  });
};
