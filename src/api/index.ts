export type {
  ReportParams,
  ReportResponse,
  AggregateParams,
  AggregateResponse,
  HttpStatus,
  ApiErrorResponse,
  ApiClientConfig,
} from "./types";

export { apiClient, ApiError } from "./client";
export { ErrorHandler } from "./errors";

export { ReportsService } from "./services/reports.service";
export { AggregateService } from "./services/aggregate.service";

import { ReportsService } from "./services/reports.service";
import { AggregateService } from "./services/aggregate.service";
import { apiClient } from "./client";
import { ErrorHandler } from "./errors";

export const api = {
  reports: ReportsService,
  aggregate: AggregateService,
  client: apiClient,
  errorHandler: ErrorHandler,
} as const;
