import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { DBTest } from './dbtest/test-component.component';
import { RegistrationFinishComponent } from './registration-finish/registration-finish.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';

const routes: Routes = [
  { path: '', component: RegistrationComponent, title: 'register' },
  { path: 'register', component: RegistrationComponent, title: 'register' },
  { path: 'test', component: DBTest, title: 'test' },
  { path: 'registration-finish', component: RegistrationFinishComponent, title: 'finish account setup' },
  { path: 'marketplace', component: MarketplaceComponent, title: 'marketplace' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
