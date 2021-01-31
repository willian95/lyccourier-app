import { Component, OnInit } from '@angular/core';
import { UrlService } from '../../services/url.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { LoadingController, AlertController} from '@ionic/angular';
import { AuthUserService } from '../../services/auth-user.service';
import { Router, NavigationExtras  } from '@angular/router';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.page.html',
  styleUrls: ['./shipping.page.scss'],
})
export class ShippingPage implements OnInit {

  url:any
  shippings:any
  loading:any
  query:any = ""
  pages:any
  page:any = 1
  isShippingCreateAvailable:any = false

  constructor(private urlService: UrlService, private http: HttpClient, public loadingController: LoadingController, private authUserService: AuthUserService, private router: Router, public alertController: AlertController) { 
    this.url = this.urlService.getUrl()
    if(!this.authUserService.checkJWT()){
      this.router.navigateByUrl("/")
    }else{

      let user = this.authUserService.getUser()
      if(user.dni_picture != null){
        this.isShippingCreateAvailable = true
      }
    }
  }

  ionViewDidEnter(){
    this.fetch()
  }

  ngOnInit() {
  }

  search(){

    if(this.query == ""){
                        
      this.fetch()

    }else{

      let headers = new HttpHeaders({
        Authorization: "Bearer "+window.localStorage.getItem('token'),
      });
  
      this.http.post(this.url+"/clients/shipping/search", {
        search: this.query,
        page: this.page
      }, {
        headers
      }).subscribe((res:any) =>{
  
        this.shippings = res.shippings
        this.pages = Math.ceil(res.shippingsCount / res.dataAmount)
  
      })

    }

  }

  fetch(page = 1){

    this.page = page

    if(this.query == ""){

      this.presentLoading()

      let headers = new HttpHeaders({
        Authorization: "Bearer "+window.localStorage.getItem('token'),
      });

      this.http.get(this.url+"/clients/shipping/fetch/"+page, {
        headers
      }).subscribe((res:any) =>{

        this.loadingDismiss()
        this.shippings = res.shippings
        this.pages = Math.ceil(res.shippingsCount / res.dataAmount)

      },
      (errorResponse: HttpErrorResponse) => {
        
        this.loadingDismiss()

      })

    }else{

      this.search()

    }

    

  }

  async presentLoading() {
    this.loading = await this.loadingController.create({});
    this.loading.present();
  }

  loadingDismiss(){
    this.loading.dismiss()
  }

  formatDate(date){

    let year = date.substring(0, 4)
    let month = date.substring(5, 7)
    let day = date.substring(8, 10)
    return day+"-"+month+"-"+year

  }

  selectShipping(shipping){

    if(shipping.shipped_at == null || shipping.shipped_at == ""){
      this.goToEdit(shipping)
    }else{
      this.goToDetail(shipping)
    }

  }

  goToEdit(shipping){

    let navigationExtras: NavigationExtras = {
      state: {
        shipping: shipping
      }
    };

    this.router.navigate(["shipping-edit"], navigationExtras)

  }

  goToDetail(shipping){

    let navigationExtras: NavigationExtras = {
      state: {
        shipping: shipping
      }
    };

    this.router.navigate(["shipping-detail"], navigationExtras)

  }

  goToShippingCreate(){

    if(this.isShippingCreateAvailable){
        this.router.navigateByUrl("/shipping-create")
    }else{
      this.presentAlert("Debes completar todos tus datos para crear un envío")
    }

  }

  async presentAlert(message, success = false) {
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

}
