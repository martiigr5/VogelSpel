import { Routes } from '@angular/router';
import { authGuard, teacherGuard } from './auth/guards/auth-guard';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Menu } from './menu/menu';
import { LevelSelect } from './level-select/level-select';
import { Level1 } from './level-select/level1/level1';
import { Laden } from './laden/laden';
import { Dashboard } from './dashboard/dashboard';
import { Leerlingen } from './dashboard/leerlingen/leerlingen';
import { Klassen } from './dashboard/klassen/klassen';
import { Levels } from './dashboard/levels/levels';
import { Meldingen } from './dashboard/meldingen/meldingen';
import { Instellingen } from './dashboard/instellingen/instellingen';
 
export const routes: Routes = [
  { path: '',                        redirectTo: '/login', pathMatch: 'full' },
  { path: 'login',                   component: Login },
  { path: 'register',                component: Register },
  { path: 'menu',                    component: Menu,         canActivate: [authGuard] },
  { path: 'level-select',            component: LevelSelect,  canActivate: [authGuard]},
  { path: 'level-select/level1',     component: Level1,       canActivate: [authGuard] },
  { path: 'laden',                   component: Laden,        canActivate: [authGuard] },
  { path: 'dashboard',               component: Dashboard,    canActivate: [teacherGuard] },
  { path: 'dashboard/leerlingen',    component: Leerlingen,   canActivate: [teacherGuard] },
  { path: 'dashboard/klassen',       component: Klassen,      canActivate: [teacherGuard] },
  { path: 'dashboard/levels',        component: Levels,       canActivate: [teacherGuard] },
  { path: 'dashboard/meldingen',     component: Meldingen,    canActivate: [teacherGuard] },
  { path: 'dashboard/instellingen',  component: Instellingen, canActivate: [teacherGuard] },
  { path: '**',                      redirectTo: '/login' }
];
 