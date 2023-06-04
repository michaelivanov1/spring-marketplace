import { Component } from '@angular/core';
import { FarmerStandService } from '../farmer-stand/farmer-stand.service';
import { farmerStand } from '../farmer-stand/farmer-stand';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss']
})

export class MarketplaceComponent {
  selectedProduct: any;
  farmerStand?: Observable<farmerStand[]>;
  farmerStandProfile: farmerStand;
  farmerStandProfiles: farmerStand[] = [];


  constructor(private farmerStandService: FarmerStandService) {
    this.farmerStandProfile = {
      id: {
        date: '',
        timestamp: '',
      },
      account: {
        id: {
          date: '',
          timestamp: '',
        },
        username: '',
        email: '',
        password: '',
      },
      produceList: [{
        id: {
          date: '',
          timestamp: '',
        },
        foodName: '',
        qty: 0,
        harvestDate: '',
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
      email: '',
      phoneNumber: '',
      profileImageURI: '',
      profileBannerURI: '',


    }
  }

  ngOnInit(): void {

    this.farmerStand = this.farmerStandService.get();
    this.farmerStand?.subscribe((farmers: farmerStand[]) => {
      // populate farmer stand profiles array
      this.farmerStandProfiles = farmers;

      farmers.forEach((farmer: farmerStand) => {
        console.log(farmer.profileImageURI);
        // farmer.produceList.forEach((produce) => {
        //   console.log(produce.foodName, produce.qty, produce.harvestDate);
        // });
      });

    });
  }


  onProductClick(farmer: farmerStand, produce: any) {
    console.log(`clicked on: ${produce.foodName} sold by ${farmer.account.username}`);
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