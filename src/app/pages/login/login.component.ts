import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  isSubmitting = false;
  errorMessage: string | null = null;

  onSubmit(): void {
    if (this.loginForm.invalid || this.isSubmitting) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    this.authService
      .login(this.loginForm.getRawValue())
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => this.router.navigateByUrl(this.getReturnUrl()),
        error: (err: HttpErrorResponse) => {
          this.errorMessage = this.toErrorMessage(err);
        }
      });
  }

  /**
   * Page demandée avant la redirection vers /login (posée par le guard).
   * N'accepte que des chemins internes, pour éviter une redirection vers un site externe.
   */
  private getReturnUrl(): string {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    const isInternal = !!returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//');
    return isInternal ? returnUrl : '/products';
  }

  private toErrorMessage(err: HttpErrorResponse): string {
    if (err.status === 0) {
      return 'Impossible de joindre le serveur. Réessayez plus tard.';
    }
    if (err.status === 401) {
      return 'E-mail ou mot de passe incorrect.';
    }
    return err.error?.detail || 'Une erreur est survenue lors de la connexion.';
  }
}
