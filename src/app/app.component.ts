import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild('testForm', { static: true }) testForm: NgForm;
  
  // tslint:disable-next-line:max-line-length
  protected searchData = ['James T. Kirk', 'Benjamin Sisko', 'Jean-Luc Picard', 'Spock', 'Spock', 'Spock', 'Spock', 'Spock', 'Spock', 'Spock', 'Spock', 'Spock', 'Spock', 'Spock', 'Jonathan Archer', 'Hikaru Sulu', 'Christopher Pike', 'Rachel Garrett'];

  public searchStr: string = 'James T. Kirk';
  private _searchStr1: string = null;
  public get searchStr1(): string {
    return this._searchStr1;
  }
  public set searchStr1(value: string) {
    this._searchStr1 = value;
    console.log(this._searchStr1);
  }

  constructor() { }

  public onSelected($event) {
    console.log($event);
  }

  public onKeyDown($event) {
    console.log($event);
  }

  public checkValid() {
    this.testForm.control.markAllAsTouched();
  }
}
