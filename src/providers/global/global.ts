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

