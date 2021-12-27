import { FastifyRequest } from "fastify";

export interface CuppaZeeProperties {
  startTime: [number, number];
  isDeprecated?: boolean;
}

export enum APIErrorType {
  Unexpected = "UNEXPECTED",
  Munzee = "MUNZEE",
  Authentication = "AUTHENTICATION",
  NotFound = "NOTFOUND",
  Unavailable = "UNAVAILABLE",
  InvalidRequest = "INVALIDREQUEST",
  Forbidden = "FORBIDDEN",
}

export interface APIAuthenticationDetails {
  user_id?: number;
  username?: string;
}

export class APIError {
  message!: string;
  type!: APIErrorType;
  authentication_details!: APIAuthenticationDetails;

  private constructor() {}

  static Unexpected(error?: Error, message?: string) {
    const apiError = new APIError();
    apiError.message = message ?? "An unexpected error occurred";
    apiError.type = APIErrorType.Unexpected;
    return apiError;
  }

  static NotFound(message?: string) {
    const apiError = new APIError();
    apiError.message = message ?? "404 - Route Not Found";
    apiError.type = APIErrorType.NotFound;
    return apiError;
  }

  static Unavailable(message?: string) {
    const apiError = new APIError();
    apiError.message = message ?? "Service Unavailable";
    apiError.type = APIErrorType.Unavailable;
    return apiError;
  }

  static async MunzeeFailure(message?: string) {
    const apiError = new APIError();
    apiError.message = message ?? "An unexpected error occurred when requesting data from Munzee.";
    apiError.type = APIErrorType.Munzee;
    return apiError;
  }

  static MunzeeInvalid(message?: string) {
    const apiError = new APIError();
    apiError.message = message ?? "CuppaZee got an invalid response from Munzee.";
    apiError.type = APIErrorType.Munzee;
    return apiError;
  }

  static Authentication(message?: string) {
    const apiError = new APIError();
    apiError.message = message ?? "Auth";
    apiError.type = APIErrorType.Authentication;
    return apiError;
  }

  static InvalidRequest(message?: string) {
    const apiError = new APIError();
    apiError.message = message ?? "Invalid Request.";
    apiError.type = APIErrorType.InvalidRequest;
    return apiError;
  }

  // create static method for Forbidden 
  static Forbidden(message?: string) {
    const apiError = new APIError();
    apiError.message = message ?? "Forbidden";
    apiError.type = APIErrorType.Forbidden;
    return apiError;
  }
}

export class APIResponse<T> {
  private constructor() {}

  statusCode!: number;
  data!: T;
  error!: APIError | null;
  executedIn!: number;
  meta: {
    isDeprecated?: boolean;
  } = {};

  static Success<T>(data: T, request: FastifyRequest) {
    const response = new APIResponse<T>();
    response.statusCode = 200;
    response.data = data;
    response.error = null;
    response.executedIn = process.hrtime(request.cuppazeeProperties.startTime)[1];
    if (request.cuppazeeProperties.isDeprecated) {
      response.meta.isDeprecated = true;
    }
    return response;
  }

  static Error(error: APIError, request: FastifyRequest) {
    const response = new APIResponse<null>();
    response.statusCode = {
      [APIErrorType.Authentication]: 403,
      [APIErrorType.Munzee]: 500,
      [APIErrorType.Unexpected]: 500,
      [APIErrorType.NotFound]: 404,
      [APIErrorType.Unavailable]: 503,
      [APIErrorType.InvalidRequest]: 400,
      [APIErrorType.Forbidden]: 403,
    }[error.type];
    response.data = null;
    response.error = error;
    response.executedIn = process.hrtime(request.cuppazeeProperties.startTime)[1];
    return response;
  }
}