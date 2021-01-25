import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShippingEditPageRoutingModule } from './shipping-edit-routing.module';

import { ShippingEditPage } from './shipping-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShippingEditPageRoutingModule
  ],
  declarations: [ShippingEditPage]
})
export class ShippingEditPageModule {}
