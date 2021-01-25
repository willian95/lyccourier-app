import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShippingDetailPage } from './shipping-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ShippingDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShippingDetailPageRoutingModule {}
