import { Routes } from '@angular/router';
import {MainLayoutComponent} from './layout/main-layout/main-layout.component';
import {HomePageComponent} from './features/shell/pages/home-page/home-page.component';
import {SettingsPageComponent} from './features/settings/pages/settings-page/settings-page.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomePageComponent },
      { path: 'settings', component: SettingsPageComponent },
    ],
  },
];
