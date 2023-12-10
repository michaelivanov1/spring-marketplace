import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatComponentsModule } from './mat-components/mat-components.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';

// components
import { RegistrationComponent } from './registration/registration.component';
import { ProfileComponent } from './profile/profile-home/profile-home.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { RegistrationFinishComponent } from './registration/registration-finish/registration-finish.component';
import { LoginComponent } from './login/login.component';
import { ConfirmationDialogComponent } from './dialogs/confirmation-dialog/confirmation-dialog.component';
import { ListItemDialogComponent } from './dialogs/listitem-dialog/listitem-dialog.component';
import { ShoppingCartComponent } from './shopping-cart/cart-home/shopping-cart.component';
import { CartitemDialogComponent } from './dialogs/cartitem-dialog/cartitem-dialog.component';
import { FarmersListComponent } from './farmers-list/farmers-list.component';
import { OrderComponent } from './order/order-home/order.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { FarmersProfileComponent } from './farmers-profile/farmers-profile.component';
import { HomePageComponent } from './home-page/home-page.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    ProfileComponent,
    MarketplaceComponent,
    RegistrationFinishComponent,
    LoginComponent,
    ConfirmationDialogComponent,
    ListItemDialogComponent,
    ShoppingCartComponent,
    CartitemDialogComponent,
    OrderComponent,
    FarmersListComponent,
    OrderDetailsComponent,
    FarmersProfileComponent,
    HomePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatComponentsModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatExpansionModule
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent],
})

export class AppModule { }