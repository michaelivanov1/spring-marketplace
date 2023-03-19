import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// added imports
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

const MaterialComponents = [
  MatButtonModule,
  MatCardModule,
  MatMenuModule,
  MatIconModule,
  MatListModule,
  MatToolbarModule,
];

@NgModule({
  declarations: [],
  imports: [CommonModule, ...MaterialComponents],
  exports: [...MaterialComponents],
})
export class MatComponentsModule {}
