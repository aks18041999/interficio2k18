import { Component, ViewChild,ElementRef } from '@angular/core';
import { Nav, Platform ,MenuController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Events } from 'ionic-angular';
import {HttpModule} from '@angular/http';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import {RulesPage} from '../pages/rules/rules';
import {QuestionPage} from '../pages/question/question';
import {LeaderboardPage} from '../pages/leaderboard/leaderboard';
import {PlayerdetailPage} from '../pages/playerdetail/playerdetail';
import {LoginPage} from '../pages/login/login';
import {RestProvider} from '../providers/rest/rest';
import {Storage} from '@ionic/storage';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  @ViewChild('map') mapElement: ElementRef;
 
  //map: any;
  TOKEN : any ;
  rootPage: any;
  loggedIn  = false;
  menu: Array<{title: string, component: any}>;
  notpages = [
      { title: 'Home', component: HomePage },
   
      {title: 'Instructions', component: RulesPage},
      {title: 'Leaderboard', component : LeaderboardPage},
      
    ];
   pages = [
     
      {title: 'Player detail', component: PlayerdetailPage},
      
      {title: 'Instructions', component: RulesPage},
      {title: 'Questions', component: QuestionPage},
      {title: 'Leaderboard', component : LeaderboardPage},
      {title: 'Log Out' , component : HomePage}
    ];
  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,public events : Events,public menuCtrl:MenuController, public rest : RestProvider,public storage : Storage) {
    this.initializeApp();
    var TOKEN = localStorage.getItem('TOKEN');

    this.menu  = TOKEN ? this.pages:this.notpages;
     
    
    events.subscribe('user:loggedin',(username)=>{
      this.menu = this.pages;
      this.openPage({title: 'Questions', component: QuestionPage});
      console.log(username);
      

    });
    events.subscribe('user:loggedout',(username)=>{
      console.log(username);
      this.menu = this.notpages;
      localStorage.removeItem('TOKEN');


    });


    // used for an example of ngFor and navigation
    
    //if(this.loggedIn == false)
   

  }
  //latitude : any ;
  //longitude : any ;

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      //localStorage.removeItem('TOKEN');
      this.TOKEN = localStorage.getItem('TOKEN');
      console.log(this.TOKEN);
      //localStorage.removeItem('PresentPage');
      this.rootPage = localStorage.getItem('PresentPage');
      console.log(this.rootPage);
      this.rootPage = this.TOKEN?QuestionPage:HomePage;
    });

    
 }

  openPage(page) {
    //events.publish('giveLocation','location');
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if(page.component!=HomePage)
    {this.nav.setRoot(page.component);
     localStorage.PresentPage = page.component;
     }
    else{
      this.events.publish('user:loggedout','logout');
      localStorage.PresentPage = page.component;
      this.nav.setRoot(page.component);
    }

  }
}