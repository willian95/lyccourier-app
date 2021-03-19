import { Component, OnInit } from '@angular/core';
import { UrlService } from '../../services/url.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AlertController,LoadingController, ModalController } from '@ionic/angular';
import { Router  } from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';

import { ProductAddPage } from '../modals//product-add/product-add.page';
import { ClientAddPage } from '../modals//client-add/client-add.page';

@Component({
  selector: 'app-shipping-create',
  templateUrl: './shipping-create.page.html',
  styleUrls: ['./shipping-create.page.scss'],
})
export class ShippingCreatePage implements OnInit {

  url:any

  departments:any = []
  provinces:any = []
  districts:any = []
  recipientList:any = []
  resellersList:any = []
  resellers:any = null
  boxes:any = []
  products:any = []
  total:number = 0
  loading:any = null
  description:any = null
  pieces:number = null
  length:number = null
  height:number = null
  width:number = null
  weight:number = null
  address:any = null
  errors:any = []
  clientDni:any = null

  tracking:string = null
  warehouse:any = null
  recipientQuery:any = null
  recipientId:any = null
  showRecipientList:boolean = false
  selectedDepartment:any = null
  selectedProvince:any = null
  selectedDistrict:any = null
  selectedReseller:any = null
  selectedBox:any = null
  dni_picture:any = null
  dni_picture_back:any = null
  base64ImageFront:any = null
  base64ImageBack:any = null

  constructor(private urlService: UrlService, private http: HttpClient, private sanitizer:DomSanitizer, public alertController: AlertController, public loadingController: LoadingController, private modalController: ModalController, private router: Router) { 
    this.url = this.urlService.getUrl()
  }

  ngOnInit() {

    this.getDepartments()
    this.getAllResellers()
    this.getBoxes()

  }

  clickFileInput(side){

    document.getElementById("add-file-input-"+side).click()

  }

  setRecipient(recipient){

    let name = recipient.name
    let lastname = recipient.lastname ? recipient.lastname : ""

    this.recipientId = recipient.id
    this.recipientQuery =  name+" "+lastname

    this.selectedReseller = null
    this.getRecipientReseller()

    this.selectedDepartment = recipient.department_id
    this.selectedProvince = recipient.province_id
    this.selectedDistrict = recipient.district_id

    this.getDistricts()

    this.dni_picture = recipient.dni_picture
    this.dni_picture_back = recipient.dni_picture_back
    this.showRecipientList = false

  }

  recipientSearch(){

    let headers = new HttpHeaders({
      Authorization: "Bearer "+window.localStorage.getItem('token'),
    });

    this.http.post(this.url+"/recipients/search", {
      "search": this.recipientQuery,
    }, {headers}).subscribe((res:any) =>{

      this.recipientList = res.recipients
      this.showRecipientList = true

    })

  }

  getDepartments(){

    this.http.get(this.url+"/departments").subscribe((res:any) =>{

      this.departments = res.departments

    })

  }

  getProvinces(){

    this.http.get(this.url+"/provinces/"+this.selectedDepartment).subscribe((res:any) =>{

      this.provinces = res.provinces

    })

  }

  getDistricts(){

    this.http.get(this.url+"/districts/"+this.selectedDepartment+"/"+this.selectedProvince).subscribe((res:any) =>{

      this.districts = res.districts
      

    })

  }

  getAllResellers(){

    this.resellers = null
    let headers = new HttpHeaders({
      Authorization: "Bearer "+window.localStorage.getItem('token'),
    });

    this.http.get(this.url+"/resellers/all", {headers}).subscribe((res:any) =>{

      this.resellersList = res.resellers

    })

  }

  getRecipientReseller(){

    let headers = new HttpHeaders({
      Authorization: "Bearer "+window.localStorage.getItem('token'),
    });

    this.http.get(this.url+"/recipients/resellers/"+this.recipientId, {headers}).subscribe((res:any) =>{

      if(res.reseller != null){
        this.resellers = res.reseller
        this.selectedReseller = this.resellers.id
      }else{
        this.getAllResellers()
      }
      

    })

  }

  getBoxes(){

    let headers = new HttpHeaders({
      Authorization: "Bearer "+window.localStorage.getItem('token'),
    });

    this.http.get(this.url+"/box/all", {headers}).subscribe((res:any) =>{
      
      this.boxes = res.boxes

    })

  }

  showPreview(event, side) {

    let file: File = event.target.files[0];
    
    if(this.validateFile(file)){

      let imageUrl = URL.createObjectURL(file);
      var myReader: FileReader = new FileReader();

      if(side == 'front'){

        this.dni_picture = this.sanitize(imageUrl)
      
      }else{

        this.dni_picture_back = this.sanitize(imageUrl)

      }

      myReader.onloadend = (e) => {

        if(side == 'front'){
          this.base64ImageFront = myReader.result;
        }else{
          this.base64ImageBack = myReader.result;
        }

        
      }
      myReader.readAsDataURL(file);

    }

  }

  validateFile(file){
    let fileType = file['type'].split('/')[0]

    if(fileType == "image"){
      return true
    }

    this.dni_picture = ""
    this.dni_picture_back = ""

    this.presentAlert("Debes subir una imagen")
    return false
  }

  sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  async presentAlert(message, success = false) {
    const alert = await this.alertController.create({
      message: message,
      buttons: [ 
        {
          text: 'Ok!',
          handler: () => {

            if(success == true){
              this.router.navigateByUrl("/")
            }

          }
        }
      ]
    });

    await alert.present();
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

  deleteProduct(index){

    this.products.splice(index, 1)
    //this.calculateProductTotal()
 
  }

  updateProduct(product, index){

    this.products[index].product = product.product
    this.products[index].price = product.price
    this.products[index].fileType = product.fileType
    this.products[index].image = product.image
    this.products[index].productImage = product.productImage

    //this.calculateProductTotal()
  }

  calculateProductTotal(){
    this.total = 0
    this.products.forEach(product => this.total += product.price)

  }

  addProduct(product){

    this.products.push(product)
    this.calculateProductTotal()

  }

  store(){

    let headers = new HttpHeaders({
      Authorization: "Bearer "+window.localStorage.getItem('token'),
    });

    this.presentLoading()

    this.http.post(this.url+'/shipping/store', {recipientId: this.recipientId, packageId: this.selectedBox, tracking: this.tracking, description: this.description, pieces: this.pieces, length: this.length, height: this.height, width: this.width, weight: this.weight, address: this.address, resellerId: this.selectedReseller, dniPicture: this.base64ImageFront, dniPictureBack: this.base64ImageBack, products: this.products, department: this.selectedDepartment, province: this.selectedProvince, district: this.selectedDistrict, clientDNI: this.clientDni, warehouseNumber: this.warehouse}, {headers})
    .subscribe((res:any) => {
        this.loadingDismiss()
        if(res.success == true){

          this.presentAlert(res.msg, true)
            
            
        }else{

          this.presentAlert(res.msg)

        }

    }, (errorResponse: HttpErrorResponse) => {
      
      this.loadingDismiss()

      this.showValidationErrors(errorResponse)
      

    })
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

  async presentRecipientModal(){
    
    const modal = await this.modalController.create({
      component: ClientAddPage,
    });
    await modal.present();

    let clientFromModal = await modal.onWillDismiss()

    this.recipientId = clientFromModal.data.data.id
    this.recipientQuery = clientFromModal.data.data.name+" "+clientFromModal.data.data.lastname
    this.showRecipientList = false

  }

}
