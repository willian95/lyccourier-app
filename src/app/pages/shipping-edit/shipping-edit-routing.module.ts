import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShippingEditPage } from './shipping-edit.page';

const routes: Routes = [
  {
    path: '',
    component: ShippingEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShippingEditPageRoutingModule {}
