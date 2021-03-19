import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShippingsPage } from './shippings.page';

const routes: Routes = [
  {
    path: '',
    component: ShippingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShippingsPageRoutingModule {}
