import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth-service.service';
import { ConfigService } from '../services/config-service.service';

/**
 * - Ajoute le JWT (Authorization: Bearer ...) aux requêtes vers NOTRE API uniquement,
 *   pour ne jamais l'envoyer à un domaine tiers.
 * - Si l'API répond 401 (token expiré ou invalide), déconnecte et renvoie vers /login.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const configService = inject(ConfigService);
  const router = inject(Router);

  const apiUrl = configService.apiUrl;
  const isApiRequest = req.url.startsWith(`${apiUrl}/`);
  // Sur /api/auth/*, un 401 signifie "identifiants incorrects" : géré par la page elle-même
  const isAuthRequest = req.url.startsWith(`${apiUrl}/api/auth/`);

  const token = authService.getToken();
  const authReq =
    isApiRequest && token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(authReq).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse && err.status === 401 && isApiRequest && !isAuthRequest) {
        authService.logout();
        router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
      }
      return throwError(() => err);
    })
  );
};
