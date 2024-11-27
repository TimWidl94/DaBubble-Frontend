import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainContentComponent } from './main-content/main-content.component';
import { RegestrationComponent } from './login/regestration/regestration.component';
import { CreateProfilComponent } from './login/create-profil/create-profil.component';
import { PasswortResetSendEmailComponent } from './login/passwort-reset-send-email/passwort-reset-send-email.component';
import { PasswortResetComponent } from './login/passwort-reset/passwort-reset.component';
import { NgModule } from '@angular/core';
import { IntroComponent } from './login/intro/intro.component';

export const routes: Routes = [
  { path: '', redirectTo: 'intro', pathMatch: 'full' },
  { path: 'intro', component: IntroComponent },
  { path: 'login', component: LoginComponent },
  { path: 'chat', component: MainContentComponent },
  { path: 'regestration', component: RegestrationComponent },
  { path: 'create-profile', component: CreateProfilComponent },
  { path: 'reset-email', component: PasswortResetSendEmailComponent },
  { path: 'reset-password', component: PasswortResetComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
