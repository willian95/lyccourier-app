import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  constructor() {
  }

  getUrl(){
    //return "http://localhost:8000/api";
    //return "https://servertest.sytes.net/lycCourier/public/api";
    return "https://lyccourier.sytes.net/api"
  }

}
