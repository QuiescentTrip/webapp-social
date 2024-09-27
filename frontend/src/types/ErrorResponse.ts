export type ErrorResponse = {
  errors: Record<string, string[]>;
  message: string;
  status: number;
  title: string;
  traceId: string;
  type: string;
};
