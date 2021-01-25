import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController,LoadingController } from '@ionic/angular';
import { ProductAddPage } from '../modals//product-add/product-add.page';
import { AuthUserService } from '../../services/auth-user.service';
import { UrlService } from '../../services/url.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shipping-create',
  templateUrl: './shipping-create.page.html',
  styleUrls: ['./shipping-create.page.scss'],
})
export class ShippingCreatePage implements OnInit {

  address:""
  tracking:""
  total:number=0
  products:any = []
  url:any
  loading:any
  errors:any = []

  constructor(private modalController: ModalController, private authUserService: AuthUserService, private urlService: UrlService, public alertController: AlertController, private http: HttpClient, public loadingController: LoadingController, private router: Router) { 
    
    this.address = this.authUserService.getAddress()
    this.url = urlService.getUrl()

  }

  ngOnInit() {
  }

  async presentModal(product, isEdit, index) {

    const modal = await this.modalController.create({
      component: ProductAddPage,
      componentProps: {
        "product": product,
        "isEdit": isEdit,
        "index": index
      }
    });
    await modal.present();

    let productFromModal = await modal.onWillDismiss()

    if(this.validateProduct(productFromModal.data.data)){

      if(productFromModal.data.data.isEdit == true){
        this.updateProduct(productFromModal.data.data, productFromModal.data.data.index)
      }else{
        this.addProduct(productFromModal.data.data)
      }
      
    }
    
  }

  addProduct(product){

    this.products.push(product)
    this.calculateProductTotal()

  }

  updateProduct(product, index){

    this.products[index].product = product.product
    this.products[index].price = product.price
    this.products[index].fileType = product.fileType
    this.products[index].image = product.image

    this.calculateProductTotal()
  }

  calculateProductTotal(){
    this.total = 0
    this.products.forEach(product => this.total += product.price)

  }

  validateProduct(product){
    
    if(product){
      if(product.hasOwnProperty("name") && product.hasOwnProperty("price") && product.hasOwnProperty("image")){
        return true
      }
  
    }

    return false
  }

  deleteProduct(index){

    this.products.splice(index, 1)
    this.calculateProductTotal()
  }

  store(){

    if(this.validateProductStore()){

      this.presentLoading()

      let headers = new HttpHeaders({
        Authorization: "Bearer "+window.localStorage.getItem('token'),
      });

      this.http.post(this.url+"/clients/shipping/store", 
        {
          "tracking": this.tracking,
          "address":this.address,
          "products": this.products
        },
        {
          headers
        }
      ).subscribe((res:any) =>{
  
        this.loadingDismiss()

        this.presentAlert(res.msg, res.success)
  
      },
      (errorResponse: HttpErrorResponse) => {
        
        this.loadingDismiss()
  
        this.showValidationErrors(errorResponse)
        
  
      })


    }

  }

  validateProductStore(){

    if(this.products.length == 0){
      this.presentAlert("Debes añadir productos para continuar")
      return false
    }
    
    else if(this.tracking == "" || this.tracking == null){
      this.presentAlert("Debes añadir productos un número de tracking para continuar")
      return false
    }

    else if(this.address == "" || this.address == null){
      this.presentAlert("Debes añadir una dirección para continuar")
      return false
    }

    return true

  }

  async presentAlert(message, success = false) {
    const alert = await this.alertController.create({
      message: message,
      buttons: [ 
        {
          text: 'Ok!',
          handler: () => {
            if(success == true){
              this.goToShipping()
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({});
    this.loading.present();
  }

  loadingDismiss(){
    this.loading.dismiss()
  }

  showValidationErrors(errorResponse){
    if (errorResponse.error) {

      if (errorResponse.error.errors) {
        
        this.presentAlert("Hay algunos campos que debe revisar", false)
        this.errors = errorResponse.error.errors
        
      }
  
    }
  }

  goToShipping(){
    this.router.navigateByUrl("/shipping")
  }

    

}
