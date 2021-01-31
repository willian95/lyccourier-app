import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.page.html',
  styleUrls: ['./product-add.page.scss'],
})
export class ProductAddPage implements OnInit {
  
  @Input() product: any;
  @Input() isEdit: any;
  @Input() index: any;

  name:string = ""
  price:number = 0
  imagePreview:any
  base64Image:any
  fileType:any
  fileName:any
  

  constructor(public modalController: ModalController, private sanitizer:DomSanitizer, public alertController: AlertController) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    console.log("product", this.product)
    if(this.product){
      this.name = this.product.product ? this.product.product : this.product.name
      this.price = this.product.price
      this.imagePreview = this.product.image
      this.base64Image = this.product.image
      this.fileType = this.product.fileType ? this.product.fileType : this.product.file_type
    }
  }

  clickFileInput(){

    document.getElementById("add-file-input").click()

  }

  showPreview(event) {

    let file: File = event.target.files[0];
    
    if(this.validateFile(file)){

      let imageUrl = URL.createObjectURL(file);
      var myReader: FileReader = new FileReader();

      this.imagePreview = this.sanitize(imageUrl)

      myReader.onloadend = (e) => {
        this.base64Image = myReader.result;
      }
      myReader.readAsDataURL(file);

    }

    

  }

  validateFile(file){
    this.fileType = file['type'].split('/')[0]

    if(this.fileType == "image" || file["type"].indexOf("pdf") >= 0){
      return true
    }

    this.base64Image = ""
    this.imagePreview = ""

    this.presentAlert("Debes subir una imagen o pdf")
    return false
  }

  validateProductInfo(){

    if((this.name != null || this.name != "") && this.price > 0 && (this.base64Image != null || this.base64Image != "")){
      return true
    }

    this.presentAlert("Debes completar todos los campos")

    return false

  }

  sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  dismiss() {

    this.modalController.dismiss({
      'dismissed': true,
    });
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      message: message,
      buttons: [ 
        {
          text: 'Ok!',
          handler: () => {
          }
        }
      ]
    });

    await alert.present();
  }

  returnProductInfo(){

    if(this.validateProductInfo()){

      let data = {
        "name": this.name,
        "price": this.price,
        "fileType": this.fileType,
        "image": this.base64Image,
        'isEdit': this.isEdit,
        "index": this.index
      }

      this.modalController.dismiss({
        'data': data
      });

    }

  }

}
