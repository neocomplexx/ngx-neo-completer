import { CtrCompleter } from './directives/ctr-completer';
import { CompleterListItemCmp } from './components/completer-list-item-cmp';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CtrDropdown } from './directives/ctr-dropdown';
import { CtrInput } from './directives/ctr-input';
import { CtrList } from './directives/ctr-list';
import { CtrRow } from './directives/ctr-row';
import { CompleterCmp } from './components/completer-cmp';
import { CompleterService } from './services/completer-service';
import { LocalDataFactory } from './services/local-data-factory';
import { RemoteDataFactory } from './services/remote-data-factory';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  declarations: [
    CompleterListItemCmp,
    CtrCompleter,
    CtrDropdown,
    CtrInput,
    CtrList,
    CtrRow,
    CompleterCmp
  ],
  exports: [
    CompleterCmp,
    CompleterListItemCmp,
    CtrCompleter,
    CtrDropdown,
    CtrInput,
    CtrList,
    CtrRow
  ]
})
export class NgxNeoCompleterModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: NgxNeoCompleterModule,
      providers: [
        CompleterService,
        LocalDataFactory,
        RemoteDataFactory
      ]
    };
  }
}
