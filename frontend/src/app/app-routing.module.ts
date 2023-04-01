import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { DBTest } from './dbtest/test-component.component';

const routes: Routes = [
  { path: '', component: RegistrationComponent, title: 'register' },
  { path: 'register', component: RegistrationComponent, title: 'register' },
  { path: 'test', component: DBTest, title: 'test' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
