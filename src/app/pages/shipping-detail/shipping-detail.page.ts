import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { UrlService } from '../../services/url.service';
import { LoadingController, AlertController, ModalController} from '@ionic/angular';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ProductAddPage } from '../modals/product-add/product-add.page';

@Component({
  selector: 'app-shipping-detail',
  templateUrl: './shipping-detail.page.html',
  styleUrls: ['./shipping-detail.page.scss'],
})
export class ShippingDetailPage implements OnInit {

  shipping:any
  status:any
  url:any
  id:any
  loading:any
  tracking:any
  address:any
  products:any
  total:any = 0
  errors:any = []

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private http: HttpClient, public loadingController: LoadingController, public alertController: AlertController, private urlService: UrlService, private modalController: ModalController) { 

    this.url = this.urlService.getUrl()
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.shipping = this.router.getCurrentNavigation().extras.state.shipping;
        this.status = this.shipping.shipping_status
        this.setValues(this.shipping)
      }
      
    });

  }

  setValues(shipping){
    this.id = shipping.id
    this.address = shipping.address
    this.products = shipping.shipping_products

    this.calculateProductTotal()

  }

  calculateProductTotal(){
    this.total = 0
    this.products.forEach(product => this.total += product.price)

  }

  dateFormat(date){

    let year = date.substring(0, 4)
    let month = date.substring(5, 7)
    let day = date.substring(8, 10)
    return day+"-"+month+"-"+year

  } 

  async confirm() {
    const alert = await this.alertController.create({
      message: "¿Estás seguro de actualizar este envío?",
      buttons: [ 
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            
          }
        }, {
          text: 'Sí',
          handler: () => {
            this.updateShipping()
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      message: message,
      buttons: [ 
        {
          text: 'Ok',
          handler: () => {
            this.goToShippings()
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

  updateShipping(){

    this.presentLoading()

    let headers = new HttpHeaders({
      Authorization: "Bearer "+window.localStorage.getItem('token'),
    });

    this.http.post(this.url+"/shippings/update", {"id": this.shipping.id}, {headers}).subscribe((res:any) => {

      this.loadingDismiss()
      this.presentAlert(res.msg)

    })

  }

  goToShippings(){
    this.router.navigateByUrl("/shippings")
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
        
        this.presentAlert("Hay algunos campos que debe revisar")
        this.errors = errorResponse.error.errors
        
      }
  
    }
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

  goToEdit(shipping){

    let navigationExtras: NavigationExtras = {
      state: {
        shipping: shipping
      }
    };

    this.router.navigate(["shipping-edit"], navigationExtras)

  }

  ngOnInit() {
  }

}
