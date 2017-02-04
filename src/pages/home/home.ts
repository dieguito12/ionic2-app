import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { MoviesProvider } from '../../providers/movies-provider';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [MoviesProvider]
})
export class HomePage {

  public movies: any;

  constructor(public navCtrl: NavController, public moviesProvider: MoviesProvider) {
    this.loadMovies();
  }

  loadMovies(){
    this.moviesProvider.load()
    .then(data => {
      this.movies = data;
    });
  }

}
