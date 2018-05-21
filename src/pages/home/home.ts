import { Component, OnInit, AfterViewInit } from '@angular/core';

import { NavController, AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';

import { SecondPage } from './../second/second';
import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { TimeoutServiceProvider } from './../../providers/timeout-service/timeout-service';
import { environment } from './../../providers/auth-service/environment';
import { GlobalProvider } from "./../../providers/global/global"

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit, AfterViewInit {

  profile = [];

  constructor(public navCtrl: NavController, public authService: AuthServiceProvider,
    public timeoutService: TimeoutServiceProvider, private globals: GlobalProvider, public alertCtrl: AlertController,
    private network: Network, public toastCtrl: ToastController) {
  }

  ngAfterViewInit() {
  }

  ngOnInit() {
    this.globals.auth.subscribe(authenticated => {
      for (let key in authenticated.user.profile) {
        this.profile.push( key + ' : ' +  authenticated.user.profile[key] );
      }

      if (authenticated.isAuthenticated) {
        this.timeoutService.setIdleTimeout();
      }
    });
  }

  loginUser() {
    var networkState = this.network.type;
    if (networkState !== 'none') {
      localStorage.removeItem(location.host + ':callback');
      window.location.href = environment.authentication.federationSigningUrl;

    } else {
      this.toastCtrl.create({
        message: 'Impossible to Login without Internet connection!',
        duration: 3000
      }).present();
    }
  }

  logoutUser() {
    this.globals.logout(environment.authentication.federationSignoutUrl);
  }

  nextPage() {
    this.navCtrl.push(SecondPage).catch(err => {
      let alert = this.alertCtrl.create({
        title: 'No entry!',
        subTitle: 'You shall not pass',
        buttons: ['Okay']
      });
      alert.present();
    });
  }

  isAuthenticated() {
    return this.globals.isAuthenticated;
  }

}
