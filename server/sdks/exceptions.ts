import { StatusCodes } from "http-status-codes";

export class ApiException extends Error {
  public httpStatusCode: number;
  public errorMessage: string;
  public extraDetails?: string;

  constructor(
    httpStatusCode: number,
    errorMessage: string,
    extraDetails?: string,
  ) {
    super(errorMessage);
    this.httpStatusCode = httpStatusCode;
    this.errorMessage = errorMessage;
    this.extraDetails = extraDetails;
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ApiException.prototype);
  }
}

export class InvalidParameterException extends ApiException {
  constructor(extraDetails?: string) {
    super(StatusCodes.BAD_REQUEST, "Invalid Parameter", extraDetails);
    Object.setPrototypeOf(this, InvalidParameterException.prototype);
  }
}

export class NotFoundException extends ApiException {
  constructor(extraDetails?: string) {
    super(StatusCodes.NOT_FOUND, "Not Found", extraDetails);
    Object.setPrototypeOf(this, NotFoundException.prototype);
  }
}

export class BadGatewayException extends ApiException {
  constructor(extraDetails?: string) {
    super(StatusCodes.BAD_GATEWAY, "Bad Gateway", extraDetails);
    Object.setPrototypeOf(this, BadGatewayException.prototype);
  }
}

export class ConflictException extends ApiException {
  constructor(extraDetails?: string) {
    super(StatusCodes.CONFLICT, "Conflict", extraDetails);
    Object.setPrototypeOf(this, ConflictException.prototype);
  }
}
