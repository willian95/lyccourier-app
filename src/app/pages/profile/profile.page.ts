import { Component, OnInit } from '@angular/core';
import { AuthUserService } from '../../services/auth-user.service';
import { UrlService } from '../../services/url.service';
import { AlertController,LoadingController } from '@ionic/angular';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ObservableService } from '../../services/observable.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user:any
  url:any
  departments:any
  provinces:any
  districts:any
  password:any
  password_confirmation:any
  base64ImageFront:any
  base64ImageBack:any
  errors:any
  loading:any

  constructor(private authUserService: AuthUserService, private urlService: UrlService, private http: HttpClient, private sanitizer:DomSanitizer, public alertController: AlertController, public loadingController: LoadingController, private authService: AuthUserService) { 

    this.user = {
      "name":"",
      "email":"",
      "address":"",
      "dni":"",
      "lastname":"",
      "dni_picture":"",
      "phone":"",
      "department_id":"",
      "province_id":"",
      "district_id":"",
      "dni_picture_back":""
    }

    this.url = urlService.getUrl()

  }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.user = this.authService.getUser()
    this.getDepartments()
    this.getProvinces()
    this.getDistricts()
  }

  getDepartments(){

    this.http.get(this.url+"/departments").subscribe((res:any) =>{
  
      this.departments = res.departments

    })

  }

  getProvinces(){

    this.http.get(this.url+"/provinces/"+this.user.department_id).subscribe((res:any) =>{
  
      this.provinces = res.provinces

    })

  }

  getDistricts(){

    this.http.get(this.url+"/districts/"+this.user.department_id+"/"+this.user.province_id).subscribe((res:any) =>{
  
      this.districts = res.districts

    })

  }

  clickFileInput(side){

    document.getElementById("add-file-input-"+side).click()

  }

  showPreview(event, side) {

    let file: File = event.target.files[0];
    
    if(this.validateFile(file)){

      let imageUrl = URL.createObjectURL(file);
      var myReader: FileReader = new FileReader();

      if(side == 'front'){

        this.user.dni_picture = this.sanitize(imageUrl)
      
      }else{

        this.user.dni_picture_back = this.sanitize(imageUrl)

      }

      myReader.onloadend = (e) => {

        if(side == 'front'){
          this.base64ImageFront = myReader.result;
        }else{
          this.base64ImageBack = myReader.result;
        }

        
      }
      myReader.readAsDataURL(file);

    }

  }

  validateFile(file){
    let fileType = file['type'].split('/')[0]

    if(fileType == "image"){
      return true
    }

    this.user.dni_picture = ""
    this.user.dni_picture_back = ""

    this.presentAlert("Debes subir una imagen o pdf")
    return false
  }

  sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  async presentAlert(message, success = false) {
    const alert = await this.alertController.create({
      message: message,
      buttons: [ 
        {
          text: 'Ok!',
          handler: () => {

            if(success == true){

            }

          }
        }
      ]
    });

    await alert.present();
  }

  update(){

    if(this.validate()){

      this.presentLoading()

      let headers = new HttpHeaders({
        Authorization: "Bearer "+window.localStorage.getItem('token'),
      });

      this.http.post(this.url+"/profile/update", {
        name: this.user.name, 
        lastname: this.user.lastname,
        phone: this.user.phone,
        address:this.user.address,
        department: this.user.department_id,
        dni: this.user.dni,
        district: this.user.district_id,
        province: this.user.province_id,
        image: this.base64ImageFront,
        imageBack: this.base64ImageBack,
        password: this.password,
        password_confirmation: this.password_confirmation
      }, {headers}).subscribe((res:any) =>{
        
        this.presentAlert("Perfil actualizado")
        this.loadingDismiss()
        this.storeUserData(res.user)

      }, (errorResponse: HttpErrorResponse) => {
      
        this.loadingDismiss()
        this.showValidationErrors(errorResponse)
  
      })

    }

  }

  storeUserData(user){
    localStorage.setItem("user", JSON.stringify(user))
  }

  validate(){

    if(this.user.name == "" || this.user.name == null){
      this.presentAlert("Debes ingresar tu nombre")
      return false
    }
    
    else if(this.user.lastname == "" || this.user.lastname == null){
      this.presentAlert("Debes ingresar tu apellido")
      return false
    }

    else if(this.user.address == "" || this.user.address == null){
      this.presentAlert("Debes ingresar tu dirección")
      return false
    }

    else if(this.user.dni == "" || this.user.dni == null){
      this.presentAlert("Debes ingresar tu DNI")
      return false
    }

    else if(this.user.dni_picture == "" || this.user.dni_picture == null){
      this.presentAlert("Debes ingresar la copia delantera de tu DNI")
      return false
    }

    else if(this.user.dni_picture_back == "" || this.user.dni_picture_back == null){
      this.presentAlert("Debes ingresar la copia trasera de tu DNI")
      return false
    }

    else if(this.user.phone == "" || this.user.phone == null){
      this.presentAlert("Debes ingresar tu teléfono")
      return false
    }


    else if(this.user.department_id == "" || this.user.department_id == null){
      this.presentAlert("Debes ingresar tu departamento")
      return false
    }

    else if(this.user.department_id == "" || this.user.department_id == null){
      this.presentAlert("Debes ingresar tu provincia")
      return false
    }

    else if(this.user.district == ""){
      this.presentAlert("Debes ingresar tu distrito")
      return false
    }

    return true

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
