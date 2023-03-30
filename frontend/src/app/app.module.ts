import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatComponentsModule } from './mat-components/mat-components.module';
import { FormsModule } from '@angular/forms';

// custom imports
import { HomeComponent } from './home/home.component';
import { DBTest } from './dbtest/test-component.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, DBTest],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatComponentsModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})

export class AppModule { }