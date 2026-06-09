import { Routes } from '@angular/router';
import { authGuard, teacherGuard } from './auth/guards/auth-guard';
 
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register').then(m => m.Register)
  },
  {
    path: 'game',
    canActivate: [authGuard],
    loadComponent: () => import('./game/game').then(m => m.Game)
  },
  {
    path: 'dashboard',
    canActivate: [teacherGuard],
    loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard)
  },
  { path: '**', redirectTo: '/login' }
];
 