import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ISuccessResponse } from '../response/response.interface';

@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ISuccessResponse<any>> {
    return next.handle().pipe(
      map((data) => ({
        status: HttpStatus.OK,
        message: 'Request successful',
        data,
      })),
    );
  }
}