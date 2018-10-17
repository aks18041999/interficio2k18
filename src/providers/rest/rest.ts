import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable,of} from 'rxjs';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {catchError,tap,map} from 'rxjs/operators';
import {Storage} from '@ionic/storage';
import {User} from '../user.model';
import {Events} from 'ionic-angular'
//import * as global from '../../global';
/*
  Generated class for the RestProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
 class level {
      level_no: number ; 
      title : string ;
      ques: string;
      map_bool: boolean ;
    }


const apiUrl = "http://142.93.220.123:8888/";
@Injectable()
export class RestProvider {
	level : level ;
  token : string ;
  username : string;
  playerdetail : any;
  constructor(public http: HttpClient, private storage : Storage,public events : Events) {
    console.log('Hello RestProvider Provider');
  }

    addUser (userData : User){
    return this.http.post(apiUrl+'api/auth/register/',userData, httpOptions)
    .subscribe((data:any)=>{
                  this.storage.set(data.user.username,data);
                  this.token = data.token; 
                  this.username = data.user.username;
                  httpOptions = {
                    headers : new HttpHeaders({'Content-Type': 'application/json','Authorization': 'Token'+data.token})

                  }
                  console.log(data);
                  this.events.publish('user:loggedin',data.user.username);
    
              }
              ,error=>{
                console.log(error);
              }
    )
  
  }
   userLogin (username : string , password : string){
     var content ={
         username : username,
         password : password
     }
    return this.http.post(apiUrl+'api/auth/login/',content, httpOptions)
    .subscribe((data:any)=>{
                  this.storage.set(data.user.username,data);
                  this.token = data.token;
                  //this.username = data.user.username;
                  httpOptions = {
                    headers : new HttpHeaders({'Content-Type': 'application/json','Authorization': 'Token '+data.token})

                  }
                  console.log(data);
                  this.events.publish('user:loggedin',data.user.username);
    
                 }
              ,error=>{
                console.log(error);
              }
    )

  }
  userLogout(username: string) {
    var userData = this.storage.get(username);
    if(userData){
      this.storage.remove(username);
      console.log("Successfully Logged Out");
    }
    else{
      console.log("An error occurred dunring the removal of key");
    }
  }
  getLevel(){
      httpOptions = {
                    headers : new HttpHeaders({'Content-Type': 'application/json','Authorization': 'Token '+this.token})

                  }
       return this.http.get(apiUrl+'api/getlevel/',httpOptions)
    
  }
  submitAns (answer : string , level_no : number){
  
    return this.http.post(apiUrl+'api/submit/ans/',{answer,level_no}, httpOptions)
    
    

  }
  submitLocation(level_no : number ,lat : number ,long :number ){
     return this.http.post(apiUrl+'api/submit/location/',{level_no,lat,long}, httpOptions)
    
  
  }
  getPlayerDetail(){
      return    this.http.get(apiUrl+'api/player/',httpOptions)
     
  }


  getLeaderboard(){

    var httpOptions1= {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
     return    this.http.get(apiUrl+'api/leaderboard/',httpOptions1);

  }
  
}