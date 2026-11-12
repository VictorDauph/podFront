import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ConfigService } from './config-service.service';

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  // Ajoute ici d'autres champs si ton backend renvoie un objet utilisateur par exemple
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);

  // JWT conservé uniquement en mémoire : champ privé natif (#), inaccessible hors de la classe,
  // y compris à l'exécution. Il est perdu au rechargement de la page.
  #token: string | null = null;

  // Récupération dynamique de l'URL de base via le ConfigService
  private get apiUrl(): string {
    return `${this.configService.apiUrl}/api/auth`;
  }

  /**
   * Inscription d'un nouvel utilisateur
   */
  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  /**
   * Validation de l'e-mail via le token reçu dans le lien
   */
  verifyEmail(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/verify`, {
      params: { token }
    });
  }

  /**
   * Connexion d'un utilisateur (génération du JWT)
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(tap(res => (this.#token = res.token)));
  }

  /**
   * JWT de l'utilisateur connecté (null si non connecté)
   */
  getToken(): string | null {
    return this.#token;
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    this.#token = null;
  }
}