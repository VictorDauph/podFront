import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  successMessage: string | null = null;
  errorMessage: string | null = null;

  onSubmit() {
    if (this.registerForm.valid) {
      const formValues = this.registerForm.value as any;

      this.authService.register(formValues).subscribe({
        next: () => {
          this.successMessage = "Inscription réussie ! Un e-mail de validation a été envoyé.";
          this.errorMessage = null;
          this.registerForm.reset();
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = err.error?.detail || "Une erreur est survenue lors de l'inscription.";
          this.successMessage = null;
        }
      });
    }
  }
}
