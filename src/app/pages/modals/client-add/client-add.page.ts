import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { UrlService } from '../../../services/url.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-client-add',
  templateUrl: './client-add.page.html',
  styleUrls: ['./client-add.page.scss'],
})
export class ClientAddPage implements OnInit {

  url:any

  name:string = null
  lastname:string = null
  email:string = null
  phone:string = null
  address:string = null
  loading:any = null
  errors:any = []
  recipientId:any = null

  constructor(public modalController: ModalController, public alertController: AlertController, private urlService: UrlService, private http: HttpClient, public loadingController: LoadingController) { 
    this.url = this.urlService.getUrl()
  }

  ngOnInit() {
  }

  dismiss() {

    this.modalController.dismiss({
      'dismissed': true,
    });
  }

  store(){

    this.presentLoading()

    let headers = new HttpHeaders({
      Authorization: "Bearer "+window.localStorage.getItem('token'),
    });

    this.http.post(this.url+"/recipients/store", {
      "name": this.name,
      "lastname": this.lastname,
      "email": this.email,
      "phone": this.phone,
      "address": this.address
    }, {headers}).subscribe((res:any) =>{
      this.loadingDismiss()
      if(res.success == true){

        this.recipientId = res.recipient.id
        this.presentAlert(res.msg, true)

      }else{
        this.presentAlert(res.msg)
      }

    }, (errorResponse: HttpErrorResponse) => {
      
      this.loadingDismiss()

      this.showValidationErrors(errorResponse)
      

    })

  }

  showValidationErrors(errorResponse){
    if (errorResponse.error) {

      if (errorResponse.error.errors) {
        
        this.presentAlert("Hay algunos campos que debe revisar", false)
        this.errors = errorResponse.error.errors
        
      }
  
    }

  }

  async presentAlert(message, success = false) {
    const alert = await this.alertController.create({
      message: message,
      buttons: [ 
        {
          text: 'Ok!',
          handler: () => {

            if(success == true){
              this.returnProductInfo()
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


  returnProductInfo(){

    let data = {
      "name": this.name,
      "lastname": this.lastname ? this.lastname : "",
      "email": this.email,
      "phone": this.phone,
      "address": this.address,
      "id": this.recipientId
    }

    this.modalController.dismiss({
      'data': data
    });

  }

  

}
