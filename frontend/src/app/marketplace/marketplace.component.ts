import { Component } from '@angular/core';
import { FarmerStandService } from '../farmer-stand/farmer-stand.service';
import { FarmerStand } from '../farmer-stand/farmer-stand';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss']
})

export class MarketplaceComponent {
  selectedProduct: any;
  farmerStand?: Observable<FarmerStand[]>;
  farmerStandProfile: FarmerStand;
  farmerStandProfiles: FarmerStand[] = [];


  constructor(private farmerStandService: FarmerStandService) {
    this.farmerStandProfile = {
      accountName: '',
      profileName: '',
      id: {
        date: '',
        timestamp: '',
      },
      produceList: [{
        id: {
          date: '',
          timestamp: '',
        },
        foodName: '',
        qty: 0,
        harvestDate: '',
        price: 0.0,
      }],
      // profileName: [{
      //   id: {
      //     date: '',
      //     timestamp: '',
      //   },
      //   foodName: '',
      //   qty: 0,
      //   harvestDate: ''
      // }],
    }
  }

  ngOnInit(): void {

    this.farmerStand = this.farmerStandService.get();
    this.farmerStand?.subscribe((farmers: FarmerStand[]) => {
      // populate farmer stand profiles array
      this.farmerStandProfiles = farmers;

      farmers.forEach((farmer: FarmerStand) => {
       
        // farmer.produceList.forEach((produce) => {
        //   console.log(produce.foodName, produce.qty, produce.harvestDate);
        // });
      });

    });
  }


  onProductClick(farmer: FarmerStand, produce: any) {
    console.log(`clicked on: ${produce.foodName} sold by ${farmer.profileName}`);
  }

  onHover() {
    this.selectedProduct = true;
  }

  onLeave() {
    this.selectedProduct = false;
  }

  getCursor(): string {
    return this.selectedProduct ? 'pointer' : 'default';
  }


}