import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-shipping-detail',
  templateUrl: './shipping-detail.page.html',
  styleUrls: ['./shipping-detail.page.scss'],
})
export class ShippingDetailPage implements OnInit {

  shipping:any
  status:any

  constructor(private activatedRoute: ActivatedRoute, private router: Router) { 

    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.shipping = this.router.getCurrentNavigation().extras.state.shipping;
        this.status = this.shipping.shipping_status
      }
      
    });

  }

  dateFormat(date){

    let year = date.substring(0, 4)
    let month = date.substring(5, 7)
    let day = date.substring(8, 10)
    return day+"-"+month+"-"+year

  } 

  ngOnInit() {
  }

}
