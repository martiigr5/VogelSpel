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
  {
    path: 'dashboard/leerlingen',
    canActivate: [teacherGuard],
    loadComponent: () => import('./dashboard/leerlingen/leerlingen').then(m => m.Leerlingen)
  },
  {
    path: 'dashboard/klassen',
    canActivate: [teacherGuard],
    loadComponent: () => import("./dashboard/klassen/klassen").then(m => m.Klassen)
  },
  {
    path: 'dashboard/levels',
    canActivate: [teacherGuard],
    loadComponent: () => import('./dashboard/levels/levels').then(m => m.Levels)
  },
  {
    path: 'dashboard/meldingen',
    canActivate: [teacherGuard],
    loadComponent: () => import('./dashboard/meldingen/meldingen').then(m => m.Meldingen)
  },
  {
    path: 'dashboard/instellingen',
    canActivate: [teacherGuard],
    loadComponent: () => import("./dashboard/instellingen/instellingen").then(m => m.Instellingen)
  },
  { path: '**', redirectTo: '/login' }
];
 