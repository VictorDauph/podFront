import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private http = inject(HttpClient);
  private config: any;

  // Charge le fichier JSON de manière synchrone avant le démarrage de l'app
  loadConfig(): Promise<void> {
    return firstValueFrom(this.http.get('/assets/config.json'))
      .then(data => {
        this.config = data;
      })
      .catch(error => {
        console.error('Impossible de charger le fichier de configuration', error);
      });
  }

  get apiUrl(): string {
    return this.config?.apiUrl || 'http://localhost:8080';
  }
}