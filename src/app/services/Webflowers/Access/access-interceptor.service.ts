import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable } from "rxjs";
import { retry, catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AccessInterceptorService implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.method == "OPTIONS") return next.handle(request);

    request.headers.set("Access-Control-Allow-Origin", "*");
    return next.handle(request).pipe(
      retry(2),
      catchError((error: HttpErrorResponse) => {
        // if (error.status == 401) {
        // }
        throw error;
      })
    );
  }
}
