import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class MoviesProvider {

  private data;

  public progressBarValue: any = 0;

  public progressBarClass: any = "hide";
  

  constructor(public http: Http) {
    console.log('Hello MoviesProvider Provider');
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
    }
  }

  load() {
    if (this.data) {
      return Promise.resolve(this.data);
    }
    return new Promise(resolve => {
      this.http.get('http://45.55.77.201:8084/movies/json')
        .map(res => res.json())
        .subscribe(data => {
          this.data = data;
          resolve(this.data);
        });
    });
  }
}
