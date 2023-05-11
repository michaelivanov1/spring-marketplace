import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { DBTest } from './dbtest/test-component.component';
import { ProfileComponent } from './profile/profile-home/profile-home.component';

const routes: Routes = [
  { path: '', component: RegistrationComponent, title: 'register' },
  { path: 'register', component: RegistrationComponent, title: 'register' },
  { path: 'test', component: DBTest, title: 'test' },
  { path: 'profile', component: ProfileComponent, title: 'profile' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
