# authOidcApp

Tutorial for creation of the Ionic application including: 
- Ionic Auth Guards page protection
- Support of the oidc-js library that provides OpenID Connect (OIDC) and OAuth2 protocol support for client-side, browser-based JavaScript client applications. 
- Idle and session timeout functionality
- Sample with the authentication against Google accounts

## Install

##### Node.js and Ionic

Node.js v4.4 or later and recent Ionic are required.

## Tutorial of the Ionic application creation

```
$ ionic start authOidcApp blank --type=ionic-angular
✔ Creating directory ./authOidcApp - done!
✔ Downloading and extracting blank starter - done!

? Would you like to integrate your new app with Cordova to target native iOS and Android? Yes
✔ Personalizing ionic.config.json and package.json - done!
> ionic integrations enable cordova --quiet
✔ Downloading integration cordova - done!
✔ Copying integrations files to project - done!
[OK] Added cordova integration!

Installing dependencies may take several minutes.

  ✨   IONIC  DEVAPP  ✨

 Speed up development with the Ionic DevApp, our fast, on-device testing mobile app

  -  🔑   Test on iOS and Android without Native SDKs
  -  🚀   LiveReload for instant style and JS updates

 ️-->    Install DevApp: https://bit.ly/ionic-dev-app    <--

> npm i
✔ Running command - done!
> git init

  🔥   IONIC  PRO  🔥

 Supercharge your Ionic development with the Ionic Pro SDK

  -  ⚠️   Track runtime errors in real-time, back to your original TypeScript
  -  📲   Push remote updates and skip the app store queue

Learn more about Ionic Pro: https://ionicframework.com/products

? Install the free Ionic Pro SDK and connect your app? No

-----------------------------------

> git add -A
> git commit -m "Initial commit" --no-gpg-sign

Next Steps:
* Go to your newly created project: cd ./authOidcApp
* Get Ionic DevApp for easy device testing: https://bit.ly/ionic-dev-app

cd ./authOidcApp
$ ionic g page Second
[OK] Generated a page named Second!
$ ionic g provider AuthService
[OK] Generated a provider named AuthService!
$ ionic g provider TimeoutService
[OK] Generated a provider named TimeoutService!
$ ionic g provider Global
[OK] Generated a provider named Global!
$ 
```

- Add to the package.json 
```
  "dependencies": {
.....
    "@ionic-native/network": "4.7.0",
    "oidc-client": "^1.4.0",
    "@ng-idle/core": "2.0.0-beta.12",
    "@ng-idle/keepalive": "2.0.0-beta.12"
.....
  },
  "description": "An Ionic project",
.....
  "config": {
    "ionic_copy": "./config/copy.config.js"
  }
.....
```
- Create the config directory
- In the config directory create the file copy.config.js with the content:
```
const copyConfig = require('../node_modules/@ionic/app-scripts/config/copy.config');
copyConfig.copyAssets = {
    src: ['{{SRC}}/assets/**/*', '{{ROOT}}/node_modules/oidc-client/dist/oidc-client.js'],
    dest: '{{WWW}}/assets'
  }
```
- Run npm install
- make sure that the file screen/app/app.module.ts looks as follows:
```
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { TimeoutServiceProvider } from '../providers/timeout-service/timeout-service';
import { GlobalProvider } from '../providers/global/global';
import { SecondPage } from './../pages/second/second';
import { Network } from '@ionic-native/network';
import { HttpModule } from '@angular/http';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SecondPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    NgIdleKeepaliveModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SecondPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    TimeoutServiceProvider,
    GlobalProvider,
    Network
  ]
})
export class AppModule {}
```

- Add to the src/assets directory the file callback.html with the content:
```
<!DOCTYPE html>
<html>

<head>
    <title>oidc-client callback</title>
</head>

<body>
    <pre id='out'></pre>
    <script src='./oidc-client.js'></script>
    <script>
        var authConf = null;
        try {
            var authConfSerialized = localStorage.getItem(location.host + ':environment.authentication');
            if (authConfSerialized) {
                authConf = JSON.parse(authConfSerialized);
            }
        } catch (err) { console.error(err); }

        Oidc.Log.logger = console;
        Oidc.Log.logLevel = Oidc.Log.DEBUG;

        var mgr = null;
        if (authConf) {
            mgr = new Oidc.UserManager(authConf);
        } else {
            mgr = new Oidc.UserManager();
        }
        mgr.signinRedirectCallback().then(function (user) {
            console.log("signin response success", user);
            var appUri = localStorage.getItem(location.host + ':callback');
            if (appUri) {
                location.assign(appUri);
            } else {
                location.assign(location.origin);
            }
        }).catch(function (err) {
            console.log("error");
            console.log(err);
            mgr.signinRedirect();
        });
    </script>
</body>

</html>
```

- Add to the src/assets directory the file silentrefresh.html with the content:
```
<!DOCTYPE html>
<html>

<head>
    <title>oidc-client silentrefresh</title>
</head>

<body>
    <script src='./oidc-client.js'></script>
    <script>
        var hash = window.location.hash.substr(1);
        var result_authorize = hash.split('&').reduce(function (result_authorize, item) {
            var parts = item.split('=');
            result_authorize[parts[0]] = parts[1];
            return result_authorize;
        }, {});

        console.info("result_authorize: " + JSON.stringify(result_authorize));

        var authConf = null;
        try {
            var authConfSerialized = localStorage.getItem(location.host + ':environment.authentication');
            if (authConfSerialized) {
                authConf = JSON.parse(authConfSerialized);
            }
        } catch (err) { console.error(err); }

        Oidc.Log.logger = console;
        Oidc.Log.logLevel = Oidc.Log.DEBUG;

        var mgr = null;
        if (authConf) {
            mgr = new Oidc.UserManager(authConf);
        } else {
            mgr = new Oidc.UserManager();
        }

        if (result_authorize['error'] !== 'interaction_required') {
            mgr.signinSilentCallback();
        }
    </script>
</body>

</html>
```

- Modify the src/providers/global/global.ts file as follows:
```
import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import * as Oidc from 'oidc-client';

@Injectable()
export class GlobalProvider {
  mgr: Oidc.UserManager = null;
  _auth: BehaviorSubject<Auth<Oidc.User>> = new BehaviorSubject<Auth<any>>(this.anonymousIdentity());

  anonymousIdentity(): Auth<any> {
    const user = {
      profile: {
        name: 'Anonymous'
      }
    };

    return new Auth<any>(user, false);
  }

  logout(federationSignoutUrl) {
    this._auth.next(this.anonymousIdentity());
    return this.mgr.signoutRedirect().then(function (resp) {
      console.log("signed out", resp);
      window.location.href = federationSignoutUrl;
    }).catch(function (err) {
      console.log(err);
    });
  };

  public get auth(): Observable<Auth<Oidc.User>> & { value: Auth<Oidc.User> } {
    return <Observable<Auth<Oidc.User>> & { value: Auth<Oidc.User> }>this._auth;
  }

  public get isAuthenticated() {
    return this._auth.value.isAuthenticated;
  }

  validateConnection(): void {
    this.mgr.signinSilent()
      .then((result) => {
        if (!result) {
          this.finalizeSession();
        }
      })
      .catch((err) => {
        this.finalizeSession();
      });
  }

  finalizeSession() {
    this.mgr.removeUser().then(() => {
      console.log("user removed");
    }).catch(function (err) {
      console.log(err);
    });
    window.location.href = window.location.href;
  }

}

export class Auth<T> {
  constructor(public user: T, isAuthenticated = true) {
    this._isAuthenticated = isAuthenticated;
  }

  protected _isAuthenticated: boolean;

  public get isAuthenticated() {
    return this._isAuthenticated;
  }
}
```

- Add the file src/providers/auth-service/environment.ts with the following content:
```
/*
 * Sample for Google
 */

export const environment = {
    production: false,
    authentication: {
        authority: 'https://accounts.google.com',
        client_id: '1078413334731-m53th1ptemc3046q1rg5d7gr0p6l6obm.apps.googleusercontent.com',
        redirect_uri: 'http://localhost:8100/assets/callback.html',
        response_type: 'id_token',
        scope: 'openid profile',
        silent_redirect_uri: 'http://localhost:8100/assets/silentrefresh.html',
        metadata: {
            issuer: 'https://accounts.google.com',
            authorization_endpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
            end_session_endpoint:'https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout',
            jwks_uri:'https://www.googleapis.com/oauth2/v3/certs'
        },
        automaticSilentRenew: true,
        silentRequestTimeout: 1000,
        filterProtocolClaims: true,
        loadUserInfo: false,
        federationSigningUrl: 'https://accounts.google.com/o/oauth2/v2/auth?response_type=id_token&scope=openid&client_id=1078413334731-m53th1ptemc3046q1rg5d7gr0p6l6obm.apps.googleusercontent.com'
            + '&redirect_uri=http://localhost:8100/assets/callback.html&nonce=0394852-3190485-2490358',
        federationSignoutUrl: 'https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://localhost:8100/',
    }
};
```

- Modify the src/providers/auth-service/auth-service.ts file as follows:
```
import { Platform } from 'ionic-angular';
import { Injectable, ApplicationRef } from '@angular/core';

import * as Oidc from 'oidc-client';
import { environment } from './environment';
import { GlobalProvider } from "../global/global"
import { Auth } from "../global/global"


@Injectable()
export class AuthServiceProvider {

  goToLastUnauthorizedUri() {
    const lastUri = localStorage.getItem(location.host + ':callback');
    if (lastUri) {
      localStorage.removeItem(location.host + ':callback');
      window.location.assign(lastUri);
    }
  }

  private static isCordova(platform?: Platform): boolean {
    try {
      const isCordova = !!((<any>window).cordova);
      let isDesktop = false;
      if (platform != null) {
        isDesktop = platform.is('core');
      }
      return isCordova && (!isDesktop);
    } catch (e) { return false; }
  }


  constructor(private application: ApplicationRef, public platform: Platform, private globals: GlobalProvider) {

    const onceLoginGetBackToLastUnauthorizedUri = true;

    if (onceLoginGetBackToLastUnauthorizedUri) {
      this.globals._auth.subscribe(auth => {
        if (auth.isAuthenticated) {
          this.goToLastUnauthorizedUri();
        }
      });
    }

    let authentication: Oidc.UserManagerSettings = environment.authentication;

    localStorage.setItem(location.host + ':environment.authentication', JSON.stringify(environment.authentication));

    let isCordova = AuthServiceProvider.isCordova();
    console.debug('isCordova');
    console.debug(<any>isCordova);
    if (isCordova != null && isCordova && platform.is('mobileweb') === false) {
      console.log('Applying cordova pattern!');

      (<any>authentication).popupNavigator = new (<any>Oidc).CordovaPopupNavigator();
      (<any>authentication).iframeNavigator = new (<any>Oidc).CordovaIFrameNavigator();
    }

    this.globals.mgr = new Oidc.UserManager(authentication);

    Oidc.Log.logger = console;
    Oidc.Log.level = Oidc.Log.DEBUG;

    this.globals.mgr.events.addUserLoaded((e) => {
      this.application.tick();
    });

    this.globals.mgr.getUser()
      .then((user) => {
        if (user) {
          console.log('User logged in');
          const auth = new Auth<Oidc.User>(user, true);
          this.globals._auth.next(auth);
        }
      })
      .catch((err) => {
      });

    this.globals.mgr.events.addUserUnloaded((e) => {
      if (!environment.production) {
        console.log("user unloaded");
      }
    });

  }

}
```

- Modify the src/providers/timeout-service/timeout-service.ts file as follows:
```
import { environment } from '../auth-service/environment';
import { Injectable } from '@angular/core';

import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import {GlobalProvider} from "../global/global"

const timeout_environment = {
  "keepalive_interval": 30,
  "idle_timeout": 60,
  "idle_timeout_countdown": 30,
  "init_idle_state": "",
  "reset_idle_state": "",
  "no_longer_idle": "You are no longer idle!"
};

@Injectable()
export class TimeoutServiceProvider {

  idleState: string = '';

  constructor(private idle: Idle, private keepalive: Keepalive, private globals: GlobalProvider) {}

  setIdleTimeout() {
    this.idleState = timeout_environment.init_idle_state;

    // sets an idle timeout of 5 seconds, for testing purposes.
    this.idle.setIdle(timeout_environment.idle_timeout);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    this.idle.setTimeout(timeout_environment.idle_timeout_countdown);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleEnd.subscribe(() => {
      this.idleState = timeout_environment.reset_idle_state;
    });

    this.idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.globals.logout(environment.authentication.federationSignoutUrl);
    });

    this.idle.onIdleStart.subscribe(() => {
      this.idleState = 'You\'ve gone idle!'
      this.idleState = timeout_environment.reset_idle_state;
    });

    this.idle.onTimeoutWarning.subscribe((countdown) => this.idleState = 'You will time out in ' + countdown + ' seconds!');

    // sets the ping interval to 15 seconds
    this.keepalive.interval(timeout_environment.keepalive_interval);

    this.keepalive.onPing.subscribe(() => {
      //this.lastPing = new Date();
      this.globals.validateConnection();
    });

    this.idle.watch();
    this.idleState = timeout_environment.reset_idle_state;
  }

}
```

- Modify the src/pages/home/home.ts file:
```
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
```

- Modify the src/pages/home/home.html file:
```
<ion-header>
  <ion-navbar>
    <ion-title>
      Ionic Blank
    </ion-title>
  </ion-navbar>
</ion-header>

<ion-content padding>

  <h2 *ngIf="isAuthenticated()" text-center>User:</h2>
  <ul *ngIf="isAuthenticated()">
    <li *ngFor="let item of profile">
      {{ item}}
    </li>
  </ul>
  <h2 *ngIf="isAuthenticated()" text-center>is logged in!
    <p>
      <strong>{{timeoutService.idleState}}</strong>
    </p>
  </h2>
  <h2 *ngIf="!isAuthenticated()" text-center>User is not logged in!</h2>

  <button full ion-button color="primary" (click)="loginUser()" *ngIf="!isAuthenticated()">Login</button>
  <button full ion-button color="danger" (click)="logoutUser()" *ngIf="isAuthenticated()">Logout</button>
  <button full ion-button color="secondary" (click)="nextPage()">Next Page</button>

</ion-content>
```

- Modify the src/pages/second/second.ts file:
```
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from './../../providers/auth-service/auth-service';
import { GlobalProvider } from "./../../providers/global/global"

/**
 * Generated class for the SecondPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-second',
  templateUrl: 'second.html',
})
export class SecondPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider, private globals: GlobalProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SecondPage');
  }

  ionViewCanEnter() {
    return this.globals.isAuthenticated;;
  }

}
```

## Running the Sample

`npm ionic:serve`

and then browse to [http://localhost:8100](http://localhost:8100).


