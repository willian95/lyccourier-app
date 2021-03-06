import { Injectable } from '@angular/core';
import { UrlService } from './url.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthUserService {

  url:any

  constructor(private urlService: UrlService, private http: HttpClient) {
    this.url = this.urlService.getUrl()
  }

  checkJWT(){

    if(localStorage.getItem("token")){

      let headers = new HttpHeaders({
        Authorization: "Bearer "+window.localStorage.getItem('token'),
      });

      return this.http.get(this.url+"/me", {headers}).subscribe((res:any) =>{
        localStorage.setItem("user", JSON.stringify(res.user))
        return true
      },
      (errorResponse: HttpErrorResponse) => {
   
        return false
  
      })

    }else{
     
      return false
    }

  }

  getAddress(){

    return JSON.parse(localStorage.getItem("user")).address

  }

  getUser(){
    return JSON.parse(localStorage.getItem("user"))
  }

}
