import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { UrlService } from '../../services/url.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { LoadingController, AlertController} from '@ionic/angular';
import { AuthUserService } from '../../services/auth-user.service';
import { Router, NavigationExtras  } from '@angular/router';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.page.html',
  styleUrls: ['./qr-scanner.page.scss'],
})
export class QrScannerPage implements OnInit {

  data: any;
  url: any;
  loading: any;
  constructor(private barcodeScanner: BarcodeScanner, private urlService: UrlService, private http: HttpClient, public loadingController: LoadingController, private authUserService: AuthUserService, private router: Router, public alertController: AlertController) { 

    //https://lyccourier.sytes.net/tracking?tracking=16127023

    this.url = this.urlService.getUrl()
    if(!this.authUserService.checkJWT()){
      this.router.navigateByUrl("/")
    }

  }

  async presentLoading() {
    this.loading = await this.loadingController.create({});
    this.loading.present();
  }

  loadingDismiss(){
    this.loading.dismiss()
  }

  scan() {
    this.data = null;
    let options = {
      showTorchButton : true,
      prompt : "",
      resultDisplayDuration: 5000
    }

    this.barcodeScanner.scan(options).then(barcodeData => {

      this.data = barcodeData;

      let tracking = this.getTracking(this.data.text)
      this.getShipping(tracking)

    }).catch(err => {
      console.log('Error', err);
    });
  }

  getTracking(text){

    let index = text.indexOf("=") + 1
    let tracking = text.substring(index, text.length)
    return tracking
  }

  getShipping(tracking){

    this.loading = true
    this.http.get(this.url+"/shippings/tracking/"+tracking).subscribe((res:any) => {
      this.loading = false
      this.goToDetail(res.shipping)

    })

  }

  goToDetail(shipping){

    let navigationExtras: NavigationExtras = {
      state: {
        shipping: shipping
      }
    };

    this.router.navigate(["shipping-detail"], navigationExtras)

  }

  ngOnInit() {
  }

}
