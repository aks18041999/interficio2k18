import { Component ,Input,Renderer2,ElementRef,Inject,ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams ,ModalController,AlertController} from 'ionic-angular';
import {LoginPage} from '../login/login';
import {RulesPage} from '../rules/rules';
import {LeaderboardPage} from '../leaderboard/leaderboard';
import {MyApp} from '../../app/app.component';
import {DOCUMENT} from '@angular/platform-browser';
import {Plugins} from '@capacitor/core';
//import //{MapComponent} from '../../components/map/map'
import {RestProvider} from '../../providers/rest/rest';

/**
 * Generated class for the QuestionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google ;
@IonicPage()
@Component({
  selector: 'page-question',
  templateUrl: 'question.html',
})
export class QuestionPage {
lat : any;
lng : any;
watchId : any;
username : string;
map1=false;
pages: Array<{title: string, component: any}>;
 @ViewChild('map') mapElement: ElementRef;
  map: any;
  marker : any;
  level : any;
  loaded = false;
   constructor(public navCtrl: NavController, public navParams: NavParams,public renderer : Renderer2,public rest : RestProvider,public alertCtrl : AlertController) {
  	this.username = navParams.get('username');
    
  }
  ionViewCanEnter() {
    console.log("in ionViewCanEnter")
    
    return new Promise((resolve, reject) => {    
 this.rest.getLevel()
   .subscribe((data:any)=>{
     this.level=data;
     this.map1 = data.map_bool;
     console.log(data);
     this.loaded = true;
     resolve(data);
   },error=>{
     console.log(error);
     reject(error);
   });
          });
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad QuestionPage');
       this.initMap()
  }
   initMap() {
     if(navigator.geolocation){
       let options={
          enableHighAccuracy: true, }       
       navigator.geolocation.getCurrentPosition((position) => {
 
                             console.log(position);
         this.lat = position.coords.latitude;
         this.lng = position.coords.longitude;
                let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
                let mapOptions = {
                    center: latLng,
                    zoom: 30
                };
                console.log(this.map1);
               if(this.map1==true){
                this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);}
                //haanresolve(true);
                let marker = new google.maps.Marker({
                  map: this.map,
                //  animation: google.maps.Animation.DROP,
                  position: latLng
              },

             
              );
      },
      error=>{console.log(error)},
      options);
     }
     else{
       console.log('nhi ho rha');
     }
  
   }
   ngOnDestroy(){
      navigator.geolocation.clearWatch(this.watchId);
   }
   
   submitAnswer(answer : string){
     this.rest.submitAns(answer,this.level.level_no)
     .subscribe((data:any)=>{
                  if(data.success == true) {
                     let alert = this.alertCtrl.create({
                    title : 'Yasss',
                    subTitle : 'Correct Answer',
                    buttons : [{text : 'Next Level',
                      handler: temp=>{
                       
                        window.location.reload();



                        //this.navCtrl
                          alert.dismiss();
                          }
                  }],
                   cssClass:'correct'
                });
                alert.present();
                      console.log('correct ans');
                  }
                  else{
                    let alert = this.alertCtrl.create({
                    title : 'OOPPPS',
                    subTitle : 'Wrong Answer',
                    buttons : ['try again'],
                     
                   cssClass:'wrong',
                    enableBackdropDismiss: false
                });
                alert.present();
                
                   console.log('wrong');                  }
                  console.log(data);
              }
              ,error=>{
                console.log(error);
              }
    )
   }
  submitLocation(){
    if(navigator.geolocation){
       let options={
          enableHighAccuracy: true, }       
       navigator.geolocation.getCurrentPosition((position) => {
 
                             console.log(position);
         this.lat = position.coords.latitude;
         this.lng = position.coords.longitude;
        this.rest.submitLocation(this.level.level_no ,this.lat,this.lng)
   .subscribe((data:any)=>{
       if(data.success == true) {
                      let alert = this.alertCtrl.create({
                    title : 'Yasss',
                    subTitle : 'Correct Answer',
                    buttons : [{text : 'Next Level',
                      handler: temp=>{
                       
                        window.location.reload();



                        //this.navCtrl
                          alert.dismiss();
                          }
                  }],
                   cssClass:'correct'
                });
                alert.present();
                console.log('correct ans');
                  }
                  else{
                       let alert = this.alertCtrl.create({
                    title : 'OOPPPS',
                    subTitle : 'Wrong Answer',
                    buttons : ['try again'],
                     
                   cssClass:'wrong',
                    enableBackdropDismiss: false
                });
                alert.present();
                //alert.dismiss();
                   console.log('wrong');                  }
                  console.log(data);
              }
              ,error=>{
                console.log(error);
              }
    )
      },
      error=>{console.log(error)},
      options);
     }
     else{
       console.log('nhi ho rha');
     }
  
   
   }

}
