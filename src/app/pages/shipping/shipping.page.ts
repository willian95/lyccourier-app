import { Component, OnInit } from '@angular/core';
import { UrlService } from '../../services/url.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { LoadingController} from '@ionic/angular';
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
  query:any
  page:any = 1

  constructor(private urlService: UrlService, private http: HttpClient, public loadingController: LoadingController, private authUserService: AuthUserService, private router: Router) { 
    this.url = this.urlService.getUrl()
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
  
      })

    }

  }

  fetch(page = 1){

    this.presentLoading()

    let headers = new HttpHeaders({
      Authorization: "Bearer "+window.localStorage.getItem('token'),
    });

    this.http.get(this.url+"/clients/shipping/fetch/"+page, {
      headers
    }).subscribe((res:any) =>{

      this.loadingDismiss()
      this.shippings = res.shippings

    },
    (errorResponse: HttpErrorResponse) => {
      
      this.loadingDismiss()

    })

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

  goToEdit(shipping){
    
    if(shipping.shipped_at == null || shipping.shipped_at == ""){

      let navigationExtras: NavigationExtras = {
        state: {
          shipping: shipping
        }
      };

      console.log("extras", navigationExtras)
      this.router.navigate(["shipping-edit"], navigationExtras)

    }

  }

}
