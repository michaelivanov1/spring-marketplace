import { Component } from '@angular/core';
import { UserStandService } from '../user-stand/user-stand.service';
import { UserStand } from '../user-stand/user-stand';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss']
})

export class MarketplaceComponent {
  selectedProduct: any;
  userStand?: Observable<UserStand[]>;
  userStandProfile: UserStand;
  userStandProfiles: UserStand[] = [];


  constructor(private userStandService: UserStandService) {
    this.userStandProfile = {
      displayName: '',
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

    this.userStand = this.userStandService.get();
    this.userStand?.subscribe((users: UserStand[]) => {
      // populate user stand profiles array
      this.userStandProfiles = users;

      users.forEach((user: UserStand) => {
       
        // user.produceList.forEach((produce) => {
        //   console.log(produce.foodName, produce.qty, produce.harvestDate);
        // });
      });

    });
  }


  onProductClick(user: UserStand, produce: any) {
    console.log(`clicked on: ${produce.foodName} sold by ${user.displayName}`);
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