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
