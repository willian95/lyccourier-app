import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UrlService } from '../../services/url.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { LoadingController, AlertController} from '@ionic/angular';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  url:any
  email:any
  errors:any
  loading:any

  constructor(private router: Router, private urlService: UrlService, private http: HttpClient, public loadingController: LoadingController, public alertController: AlertController) {
    this.url = this.urlService.getUrl()
  }

  ngOnInit() {
  }

  restore(){
    
    this.presentLoading()

    this.http.post(this.url+"/password/verify", {
      "email": this.email
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
              this.goToLogin()
            }
          }
        }
      ]
    });

    await alert.present();
  }

  goToLogin(){
    this.router.navigateByUrl("/login")
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
