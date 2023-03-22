import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let headers = request.headers.append(
      'Authorization',
      'Bearer ' + environment.Api.Token
    );
    headers = headers.append('enctype', 'multipart/form-data');
    let newRequest = request.clone({
      headers: headers,
      url: environment.Api.BaseURL + request.url,
    });
    return next.handle(newRequest);
  }
}
