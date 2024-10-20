import { HttpInterceptorFn } from '@angular/common/http';

export const httpAuthorizationInterceptor: HttpInterceptorFn = (req, next) => {
  //console.log('INICIO - httpAuthorizationInterceptor');
  if(req.method == 'POST'){
    
    const reqCloned = req.clone({
      headers:req.headers.set('X-Authorization', 'my-api-token')
    })
    //console.log('POST - httpAuthorizationInterceptor');
    return next(reqCloned);
  }
  //console.log('RESPUESTA - httpAuthorizationInterceptor');
  return next(req);
};
