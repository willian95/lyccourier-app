import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShippingCreatePage } from './shipping-create.page';

const routes: Routes = [
  {
    path: '',
    component: ShippingCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShippingCreatePageRoutingModule {}
