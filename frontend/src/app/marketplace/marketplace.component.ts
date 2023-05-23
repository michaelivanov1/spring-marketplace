import { Component } from '@angular/core';
import { productData } from './product-data';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss']
})

export class MarketplaceComponent {

  selectedProduct: any;
  products = productData;
  isHovered = false;

  // eventually will open modal or new page for more product info/purchase product
  onProductClick(product: any) {
    console.log(`clicked on: ${product.name}`);
    return this.selectedProduct === product ? this.selectedProduct = null : this.selectedProduct = product;
  }

  // change cursor on hover 
  onHover() {
    this.isHovered = true;
  }
  onLeave() {
    this.isHovered = false;
  }
  getCursor(): string {
    return this.isHovered ? 'pointer' : 'default';
  }
}