import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UrlService } from '../../services/url.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { LoadingController, AlertController} from '@ionic/angular';
import { AuthUserService } from '../../services/auth-user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  url:any
  email:any
  password:any
  loading:any
  errors:any
  passwordInputType:any = "password"
  passwordInputIcon:any = "eye-outline"

  constructor(private router: Router, private urlService: UrlService, private http: HttpClient, public loadingController: LoadingController, public alertController: AlertController, private authUserService: AuthUserService) { 
    this.url = this.urlService.getUrl()

  }

  ionViewDidEnter(){
    if(this.authUserService.checkJWT()){
      this.goToShipping()
    }
  }

  ngOnInit() {
  }

  login(){
    
    this.presentLoading()

    this.http.post(this.url+"/login", {
      "email": this.email,
      "password":this.password,
    }).subscribe((res:any) =>{

      this.loadingDismiss()
      this.storeUserData(res.user)
      this.storeJWTToken(res.token)
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
              this.goToShipping()
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

  storeJWTToken(token){
    localStorage.setItem("token", token)
  }

  storeUserData(user){
    localStorage.setItem("user", JSON.stringify(user))
  }

  goToRegister(){
    this.router.navigateByUrl("/register")
  }

  goToShipping(){
    this.router.navigateByUrl("/shipping")
  }

  togglePasswordInputType(){

    if(this.passwordInputType == "password"){

      this.passwordInputType = "text"
      this.passwordInputIcon = "eye-off-outline"

    }else{

      this.passwordInputType = "password"
      this.passwordInputIcon = "eye-outline"

    }
    
  }

}
