import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, tap } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (request, next) => {
  //console.log('Request intercepted by HTTP Error inteceptor!', request);
  // gestión
  return next(request).pipe(
    tap((event) => {
      // console.warn('Response intercepted by HTTP Error interceptor!', event);
    }),
    catchError((error) => {
      // alert(`Http call to ${request.url} failed, try again later`);
      throw new Error(`HTTP Error interceptor: Http call failed due to error ${error.message}`);
    }),
  );
};
