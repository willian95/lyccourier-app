import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UrlService } from '../../services/url.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ModalController, AlertController,LoadingController } from '@ionic/angular';
import { ProductAddPage } from '../modals//product-add/product-add.page';

@Component({
  selector: 'app-shipping-edit',
  templateUrl: './shipping-edit.page.html',
  styleUrls: ['./shipping-edit.page.scss'],
})
export class ShippingEditPage implements OnInit {

  id:any
  address:""
  tracking:""
  total:number=0
  products:any = []
  url:any
  loading:any
  errors:any = []

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private urlService: UrlService, public alertController: AlertController, private http: HttpClient, public loadingController: LoadingController, private modalController: ModalController) {

    this.url = this.urlService.getUrl()
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        let shipping = this.router.getCurrentNavigation().extras.state.shipping;
        this.setValues(shipping)
      }
      
    });

  }

  setValues(shipping){
    this.id = shipping.id
    this.address = shipping.address
    this.tracking = shipping.tracking
    this.products = shipping.shipping_products

    this.calculateProductTotal()

  }

  calculateProductTotal(){
    this.total = 0
    this.products.forEach(product => this.total += product.price)

  }

  async presentLoading() {
    this.loading = await this.loadingController.create({});
    this.loading.present();
  }

  loadingDismiss(){
    this.loading.dismiss()
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

  validateProduct(product){
    
    if(product){
      if(product.hasOwnProperty("name") && product.hasOwnProperty("price") && product.hasOwnProperty("image")){
        return true
      }
    }

    return false
  }

  update(){

    if(this.validateProductUpdate()){

      this.presentLoading()

      let headers = new HttpHeaders({
        Authorization: "Bearer "+window.localStorage.getItem('token'),
      });

      this.http.post(this.url+"/clients/shipping/update", 
        {
          "id": this.id,
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

  validateProductUpdate(){

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

  addProduct(product){
    
    this.products.push(product)
    this.calculateProductTotal()

  }

  updateProduct(product, index){

    this.products[index].name = product.product ? product.product : product.name 
    this.products[index].price = product.price
    this.products[index].file_type = product.fileType
    this.products[index].image = product.image

    this.calculateProductTotal()
  }

  deleteProduct(index){

    this.products.splice(index, 1)
    this.calculateProductTotal()
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

  ngOnInit() {
  }

}
