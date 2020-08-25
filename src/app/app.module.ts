import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { NgxNeoCompleterModule } from 'ngx-neo-completer';
// import { NgxNeoCompleterMatModule } from 'ngx-neo-completer-mat';
import { NgxNeoCompleterMatModule } from 'projects/ngx-neo-completer-mat/src/lib/ngx-neo-completer-mat.module';
import { NgxNeoCompleterModule } from 'projects/ngx-neo-completer/src/lib/ngx-neo-completer.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    NgxNeoCompleterMatModule.forRoot(),
    NgxNeoCompleterModule.forRoot(),
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}
