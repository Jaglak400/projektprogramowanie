import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  // Metoda intercept przechwytuje wszystkie wychodzące żądania HTTP
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Klonowanie żądania i dodanie opcji withCredentials: true aby wysyłać ciasteczka wraz z żądaniem
    req = req.clone({
      withCredentials: true,
    });
    // Przekazanie zmodyfikowanego żądania do następnego interceptora lub do serwera
    return next.handle(req);
  }
}

// Zdefiniowanie dostawcy dla HTTP_INTERCEPTORS który używa HttpRequestInterceptor
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
  // multi: true oznacza że można zarejestrować wiele interceptorów a nie tylko jeden
];
