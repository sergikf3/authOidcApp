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
