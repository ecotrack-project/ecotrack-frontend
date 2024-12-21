import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
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
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(authReq);
};



