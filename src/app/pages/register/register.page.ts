import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UrlService } from '../../services/url.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { LoadingController, AlertController} from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  url:any
  name:any
  lastname:any
  email:any
  address:any
  password:any
  password_confirmation:any
  loading:any
  errors:any

  constructor(private router: Router, private urlService: UrlService, private http: HttpClient, public loadingController: LoadingController, public alertController: AlertController) { 
    this.url = this.urlService.getUrl()
  }

  ngOnInit() {
  }

  register(){

    this.presentLoading()

    this.http.post(this.url+"/register", {
      "name":this.name,
      "lastname":this.lastname,
      "email": this.email,
      "address":this.address,
      "password":this.password,
      "password_confirmation":this.password_confirmation
    }).subscribe((res:any) =>{

      this.loadingDismiss()
      this.presentAlert(res.msg, res.success)

    },
    (errorResponse: HttpErrorResponse) => {
      
      this.loadingDismiss()

      this.showValidationErrors(errorResponse)
      

    })

  }

  async presentAlert(message, success) {
    const alert = await this.alertController.create({
      message: message,
      buttons: [ 
        {
          text: 'Ok!',
          handler: () => {
            if(success == true){
              this.router.navigateByUrl("/login")
            }
          }
        }
      ]
    });

    await alert.present();
  }

  showValidationErrors(errorResponse){
    if (errorResponse.error) {

      if (errorResponse.error.errors) {
        
        this.presentAlert("Hay algunos campos que debe revisar", false)
        this.errors = errorResponse.error.errors
        
  
      }
  
    }
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({});
    this.loading.present();
  }

  loadingDismiss(){
    this.loading.dismiss()
  }

}
