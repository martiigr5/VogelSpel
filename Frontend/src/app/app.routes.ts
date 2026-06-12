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
  path: 'laden',
  canActivate: [authGuard],
  loadComponent: () => import('./laden/laden').then(m => m.Laden)
  },
  {
    path: 'game/level1',
    canActivate: [authGuard],
    loadComponent: () => import('./game/level1/level1').then(m => m.Level1)
  },
  {
    path: 'dashboard',
    canActivate: [teacherGuard],
    loadComponent: () => import('./dashboard/dashboard').then(m => m.Dashboard)
  },
  {
    path: 'menu',
    canActivate: [authGuard],
    loadComponent: () => import('./menu/menu').then(m => m.Menu)
  },
  { path: '**', redirectTo: '/login' }
];
 