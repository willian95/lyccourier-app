import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  constructor() {
  }

  getUrl(){
    return "http://localhost:8000/api";
    //return "https://servertest.sytes.net/buscoabogado/public";
  }

}
