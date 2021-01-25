import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShippingDetailPageRoutingModule } from './shipping-detail-routing.module';

import { ShippingDetailPage } from './shipping-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShippingDetailPageRoutingModule
  ],
  declarations: [ShippingDetailPage]
})
export class ShippingDetailPageModule {}
