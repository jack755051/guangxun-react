export class ApiError<T = unknown> extends Error {
  public status: number;
  public data?: T;
  public headers?: Headers;

  constructor(status: number, message: string, data?: T, headers?: Headers) {
    super(message);
    this.status = status;
    this.data = data;
    this.headers = headers;
    this.name = "ApiError";
  }
}
