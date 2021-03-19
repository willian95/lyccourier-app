import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthUserService } from '../services/auth-user.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private router:Router, public authUserService: AuthUserService) {}

  ionViewDidEnter(){
    if(this.authUserService.checkJWT()){
      this.goToShipping()
    }
  }

  goToLogin(){

    this.router.navigateByUrl("/login")

  }

  goToShipping(){
    this.router.navigateByUrl("/shippings")
  }



}
