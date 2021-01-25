import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShippingCreatePageRoutingModule } from './shipping-create-routing.module';

import { ShippingCreatePage } from './shipping-create.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShippingCreatePageRoutingModule
  ],
  declarations: [ShippingCreatePage]
})
export class ShippingCreatePageModule {}
