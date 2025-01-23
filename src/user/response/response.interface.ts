import { HttpStatus } from "@nestjs/common";

export interface ISuccessResponse<T> {
  status: HttpStatus;
  message: string;
  data: T;
}