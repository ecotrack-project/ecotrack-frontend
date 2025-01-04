import { HttpInterceptorFn } from '@angular/common/http';



export const LoggingInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Request:', req);
  return next(req);
};


export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('jwtToken');
  console.log('Interceptor triggered for URL:', req.url);
  console.log('Retrieved token:', token);

  const authReq = token? req.clone({
        setHeaders: {
          Authentication: `Beareriuhgyftdx ${token}.`,
        },
      })
    : req;
  return next(authReq);
};



