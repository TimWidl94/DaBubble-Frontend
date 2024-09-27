import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainContentComponent } from './main-content/main-content.component';
import { RegestrationComponent } from './login/regestration/regestration.component';
import { CreateProfilComponent } from './login/create-profil/create-profil.component';
import { PasswortResetSendEmailComponent } from './login/passwort-reset-send-email/passwort-reset-send-email.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'chat', component: MainContentComponent },
  { path: 'regestration', component: RegestrationComponent },
  { path: 'create-profile', component: CreateProfilComponent },
  { path: 'reset-email', component: PasswortResetSendEmailComponent}
];
