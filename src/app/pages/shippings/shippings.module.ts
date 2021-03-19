import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShippingsPageRoutingModule } from './shippings-routing.module';

import { ShippingsPage } from './shippings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShippingsPageRoutingModule
  ],
  declarations: [ShippingsPage]
})
export class ShippingsPageModule {}
