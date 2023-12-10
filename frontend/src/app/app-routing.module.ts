import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { ProfileComponent } from './profile/profile-home/profile-home.component';
import { RegistrationFinishComponent } from './registration/registration-finish/registration-finish.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { LoginComponent } from './login/login.component';
import { ShoppingCartComponent } from './shopping-cart/cart-home/shopping-cart.component';
import { OrderComponent } from "@app/order/order-home/order.component";
import { FarmersListComponent } from './farmers-list/farmers-list.component';
import { OrderDetailsComponent } from "@app/order-details/order-details.component";
import { FarmersProfileComponent } from './farmers-profile/farmers-profile.component';
import { HomePageComponent } from './home-page/home-page.component';


const routes: Routes = [
  { path: '', component: HomePageComponent, title: 'Home' },
  { path: 'home', component: HomePageComponent, title: 'Home' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'register', component: RegistrationComponent, title: 'Register' },
  { path: 'profile', component: ProfileComponent, title: 'Profile' },
  {
    path: 'registration-finish',
    component: RegistrationFinishComponent,
    title: 'Finish Account Setup',
  },
  {
    path: 'marketplace',
    component: MarketplaceComponent,
    title: 'Marketplace',
  },
  {
    path: 'shopping-cart',
    component: ShoppingCartComponent,
    title: 'Shopping Cart',
  },
  {
    path: 'orders',
    component: OrderComponent,
    title: 'Orders'
  },
  {
    path: 'order/:id',
    component: OrderDetailsComponent,
    title: 'Order'
  },
  {
    path: 'farmers',
    component: FarmersListComponent,
    title: 'Farmers',
  },
  {
    path: 'farmers-profile',
    component: FarmersProfileComponent,
    title: 'Farmers Profile'
  }

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule { }