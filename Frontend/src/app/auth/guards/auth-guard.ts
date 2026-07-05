import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

// AuthGuard beschermt routes die alleen toegangkelijk zijn voor ingelogde gebruikers
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

// Inloggen en teacher moeten gelijk zijn, leerling wordt ook doorgestuurd naar login
export const teacherGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.isTeacher()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};