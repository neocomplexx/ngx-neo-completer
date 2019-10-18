import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  // tslint:disable-next-line:max-line-length
  protected searchData = ['James T. Kirk', 'Benjamin Sisko', 'Jean-Luc Picard', 'Spock','Spock','Spock','Spock','Spock','Spock','Spock','Spock','Spock','Spock','Spock', 'Jonathan Archer', 'Hikaru Sulu', 'Christopher Pike', 'Rachel Garrett' ];

  public searchStr: string;

  constructor() { }

  public onSelected($event) {
    console.log($event);
  }
}
