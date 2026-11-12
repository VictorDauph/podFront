import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { ProductsComponent } from './pages/products/products.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'products', component: ProductsComponent, canActivate: [authGuard] },
  /*
  { 
    path: 'verify-email', 
    loadComponent: () => import('./features/auth/verify-email/verify-email.component').then(m => m.VerifyEmailComponent) 
  },
  */
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirection par défaut
  { path: '**', redirectTo: 'login' } // Route wildcard (404)
];