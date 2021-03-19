import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'shippings',
    loadChildren: () => import('./pages/shippings/shippings.module').then( m => m.ShippingsPageModule)
  },
  {
    path: 'shipping-detail',
    loadChildren: () => import('./pages/shipping-detail/shipping-detail.module').then( m => m.ShippingDetailPageModule)
  },
  {
    path: 'qr-scanner',
    loadChildren: () => import('./pages/qr-scanner/qr-scanner.module').then( m => m.QrScannerPageModule)
  },
  {
    path: 'product-add',
    loadChildren: () => import('./pages/modals/product-add/product-add.module').then( m => m.ProductAddPageModule)
  },
  {
    path: 'shipping-create',
    loadChildren: () => import('./pages/shipping-create/shipping-create.module').then( m => m.ShippingCreatePageModule)
  },
  {
    path: 'shipping-edit',
    loadChildren: () => import('./pages/shipping-edit/shipping-edit.module').then( m => m.ShippingEditPageModule)
  },
  {
    path: 'client-add',
    loadChildren: () => import('./pages/modals/client-add/client-add.module').then( m => m.ClientAddPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
