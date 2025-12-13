export class ApiError<T = unknown> extends Error {
  public status: number;
  public data?: T;

  constructor(status: number, message: string, data?: T) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}
