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
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'shipping',
    loadChildren: () => import('./pages/shipping/shipping.module').then( m => m.ShippingPageModule)
  },
  {
    path: 'shipping-detail',
    loadChildren: () => import('./pages/shipping-detail/shipping-detail.module').then( m => m.ShippingDetailPageModule)
  },
  {
    path: 'shipping-create',
    loadChildren: () => import('./pages/shipping-create/shipping-create.module').then( m => m.ShippingCreatePageModule)
  },
  {
    path: 'product-add',
    loadChildren: () => import('./pages/modals/product-add/product-add.module').then( m => m.ProductAddPageModule)
  },
  {
    path: 'shipping-edit',
    loadChildren: () => import('./pages/shipping-edit/shipping-edit.module').then( m => m.ShippingEditPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
