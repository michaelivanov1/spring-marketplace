import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  orderId: string;

  constructor(
    private route: ActivatedRoute,
  ) {
    this.orderId = "";
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.orderId = params['id']; // Convert the parameter to a number
      // Fetch the order details based on this.orderId
      // Display the order details in your template
    });
  }

}
