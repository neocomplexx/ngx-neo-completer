'use strict';
import {
    ChangeDetectorRef, Component, Input, Output, EventEmitter,
    ViewChild, forwardRef, ElementRef, AfterViewChecked, OnInit, AfterViewInit
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators, NgForm } from '@angular/forms';

import { CtrCompleter } from '../directives/ctr-completer';
import { CompleterData } from '../services/completer-data';
import { CompleterService } from '../services/completer-service';
import { CompleterItem } from './completer-item';
import { MAX_CHARS, MIN_SEARCH_LENGTH, PAUSE, TEXT_SEARCHING, TEXT_NO_RESULTS } from '../globals';

const noop = () => { };

const COMPLETER_CONTROL_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CompleterCmp),
    multi: true
};


@Component({
    // tslint:disable:max-line-length
    selector: 'neo-completer-mat',
    template: `
    <mat-form-field [ngClass]="formFieldClass" [appearance]="appearance">
        <mat-label *ngIf="appearance">{{placeholder}}</mat-label>
        <div class="completer-holder" ctrCompleter>
            <input #ctrInput [class.none-display]="completerItem" [required]="required" matInput [attr.id]="inputId.length > 0 ? inputId : null" type="search" class="completer-input" ctrInput [ngClass]="inputClass"
                [(ngModel)]="searchStr" (ngModelChange)="onChange($event)" [attr.name]="inputName" [placeholder]="placeholder"
                [attr.maxlength]="maxChars" [tabindex]="fieldTabindex" [disabled]="ctrInputHidden.disabled"
                [clearSelected]="clearSelected" [clearUnselected]="clearUnselected" 
                [overrideSuggested]="overrideSuggested" [openOnFocus]="openOnFocus" [fillHighlighted]="fillHighlighted"
                [openOnClick]="openOnClick" [selectOnClick]="selectOnClick" [autoSelectOnEnter]="autoSelectOnEnter"
                (blur)="onBlur()" (focus)="onFocus()" (keyup)="onKeyup($event)" (keydown)="onKeydown($event)" (click)="onClick($event)"
                autocomplete="off" autocorrect="off" autocapitalize="off" />
            <input #ctrInputHidden [class.none-display]="true" matInput [formControl]="control"/>
            <div class="completer-dropdown-holder"
                *ctrList="dataService;
                    minSearchLength: minSearchLength;
                    pause: pause;
                    autoMatch: autoMatch;
                    initialValue: initialValue;
                    autoHighlight: autoHighlight;
                    displaySearching: displaySearching;
                    let items = results;
                    let searchActive = searching;
                    let isInitialized = searchInitialized;
                    let isOpen = isOpen;">
                <div class="completer-dropdown" ctrDropdown *ngIf="isInitialized && isOpen && (( items?.length > 0|| (displayNoResults && !searchActive)) || (searchActive && displaySearching))">
                    <div *ngIf="searchActive && displaySearching" class="completer-searching">{{_textSearching}}</div>
                    <div *ngIf="!searchActive && (!items || items?.length === 0)" class="completer-no-results">{{_textNoResults}}</div>
                    <div class="completer-row-wrapper" *ngFor="let item of items; let rowIndex=index">
                        <div class="completer-row" [ctrRow]="rowIndex" [dataItem]="item">
                            <div *ngIf="item.image || item.image === ''" class="completer-image-holder">
                                <img *ngIf="item.image != ''" src="{{item.image}}" class="completer-image" />
                                <div *ngIf="item.image === ''" class="completer-image-default"></div>
                            </div>
                            <div class="completer-item-text" [ngClass]="{'completer-item-text-image': item.image || item.image === '' }">
                                <completer-list-item class="completer-title" [text]="item.title" [matchClass]="matchClass" [searchStr]="searchStr" [type]="'title'"></completer-list-item>
                                <completer-list-item *ngIf="item.description && item.description != ''" class="completer-description" [text]="item.description"
                                    [matchClass]="matchClass" [searchStr]="searchStr" [type]="'description'">
                                </completer-list-item>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div *ngIf="completerItem" class="completer-holder">
            <mat-chip-list [disabled]="ctrInputHidden.disabled">
                <mat-chip id="chip-badge" [selectable]="true" [removable]="true" (removed)="removeItem()">
                    <span class="">{{completerItem?.title}}</span>
                    <mat-icon matChipRemove>cancel</mat-icon>
                </mat-chip>
            </mat-chip-list>
        </div>
    </mat-form-field>
    `,
    styleUrls: ['completer-cmp.scss'],
    providers: [COMPLETER_CONTROL_VALUE_ACCESSOR]
})
// tslint:disable-next-line:component-class-suffix
export class CompleterCmp implements OnInit, ControlValueAccessor, AfterViewChecked, AfterViewInit {
    @Input() public dataService: CompleterData;
    @Input() public required: boolean;
    @Input() public name: string;    
    @Input() public inputName = '';
    @Input() public inputId = '';
    @Input() public pause = PAUSE;
    @Input() public minSearchLength = MIN_SEARCH_LENGTH;
    @Input() public maxChars = MAX_CHARS;
    @Input() public overrideSuggested = false;
    @Input() public clearSelected = false;
    @Input() public clearUnselected = false;
    @Input() public fillHighlighted = true;
    @Input() public placeholder = '';
    @Input() public matchClass: string;
    @Input() public fieldTabindex: number;
    @Input() public autoMatch = false;
    @Input() public disableInput = false;
    @Input() public inputClass: string;
    @Input() public formFieldClass: string;
    @Input() public autofocus = false;
    @Input() public openOnFocus = false;
    @Input() public openOnClick = false;
    @Input() public selectOnClick = false;
    @Input() public initialValue: any;
    @Input() public autoHighlight = false;
    @Input() public autoSelectOnEnter = true;
    @Input() public appearance = '';
    @Input() public form: NgForm;

    @Output() public selected = new EventEmitter<CompleterItem>();
    @Output() public highlighted = new EventEmitter<CompleterItem>();
    // tslint:disable:no-output-rename
    @Output('blur') public blurEvent = new EventEmitter<void>();
    @Output() public click = new EventEmitter<void>();
    @Output('focus') public focusEvent = new EventEmitter<void>();
    @Output() public opened = new EventEmitter<boolean>();
    @Output() public keyup: EventEmitter<any> = new EventEmitter();
    @Output() public keydown: EventEmitter<any> = new EventEmitter();

    @ViewChild(CtrCompleter, { static: true }) public completer: CtrCompleter;
    @ViewChild('ctrInput', { static: true }) public ctrInput: ElementRef;

    public searchStr = '';
    public control = new FormControl('');
    public displaySearching = true;
    public displayNoResults = true;
    public _textNoResults = TEXT_NO_RESULTS;
    public _textSearching = TEXT_SEARCHING;
    public completerItem: CompleterItem;

    private _onTouchedCallback: () => void = noop;
    private _onChangeCallback: (_: any) => void = noop;
    private _focus = false;
    private _open = false;

    private _onlyOnInit = true;

    constructor(private completerService: CompleterService, private cdr: ChangeDetectorRef) { }

    get value(): string | CompleterItem { return (this.completerItem) ? this.completerItem.originalObject : this.searchStr; }

    set value(v: CompleterItem | string ) {
        if (typeof (v) === 'string') {
            this.searchStr = v;
        } else {
            this.completerItem = v;
        }
    }

    public ngAfterViewInit() {
        if (this.autofocus) {
            this._focus = true;
        }
    }

    public ngAfterViewChecked(): void {
        if (this._focus) {
            setTimeout(
                () => {
                    if (this.ctrInput) {
                        this.ctrInput.nativeElement.focus();
                        this._focus = false;
                    }
                },
                0
            );
        }
    }

    public onTouched() {
        this._onTouchedCallback();
    }

    public writeValue(value: any) {
        if (value && (value.id  === 0 || value.id  === 0)) value = null;
        if (value && this.dataService.convertToItem) {
            this.completerItem = this.dataService.convertToItem!(value) as CompleterItem;
            this.searchStr = this.completerItem.title;
        } else {
            this.completerItem = null;
            this.searchStr = null;
        }
    }

    public registerOnChange(fn: any) {
        this._onChangeCallback = fn;
    }

    public registerOnTouched(fn: any) {
        this._onTouchedCallback = fn;
    }

    public setDisabledState(isDisabled: boolean): void {
        this.disableInput = isDisabled;
        if (!this.form) {
            if (isDisabled) {
                this.control.disable({onlySelf: false, emitEvent: true});
            } else {
                this.control.enable({onlySelf: false, emitEvent: true});
            }
        }
    }

    @Input()
    public set datasource(source: CompleterData | string | Array<any>) {
        if (source) {
            if (source instanceof Array) {
                this.dataService = this.completerService.local(source);
            } else if (typeof (source) === 'string') {
                this.dataService = this.completerService.remote(source);
            } else {
                this.dataService = source;
            }
        }
    }

    @Input()
    public set textNoResults(text: string) {
        if (this._textNoResults !== text) {
            this._textNoResults = text;
            this.displayNoResults = !!this._textNoResults && this._textNoResults !== 'false';
        }
    }

    @Input()
    public set textSearching(text: string) {
        if (this._textSearching !== text) {
            this._textSearching = text;
            this.displaySearching = !!this._textSearching && this._textSearching !== 'false';
        }
    }

    public ngOnInit() {
        if (<any>this.required === '') this.required = true;
        if (this.required) {
            this.control.setValidators(Validators.required);
        }
        if (this.form) {
            this.form.control.addControl(this.name, this.control);
            this.form.control.get(this.name).updateValueAndValidity();
        }
      
        this.completer.selected.subscribe((item: CompleterItem) => {
            this.completerItem = item;
            if (!this.completerItem) this.searchStr = undefined;
            this._onChangeCallback((this.completerItem) ? this.completerItem.originalObject : null);
            this.selected.emit(item);
        });
        this.completer.highlighted.subscribe((item: CompleterItem) => {
            this.highlighted.emit(item);
        });
        this.completer.opened.subscribe((isOpen: boolean) => {
            this._open = isOpen;
            this.opened.emit(isOpen);
        });
    }

    public removeItem() {
        this.completerItem = undefined;
        this.searchStr = undefined;
        this._onChangeCallback((this.completerItem) ? this.completerItem.originalObject : null);
        this.selected.emit(null);
        setTimeout(() => {
            if (this.ctrInput) {
                this.ctrInput.nativeElement.focus();
                this._focus = false;
            }
        }, 10);
    }

    public onBlur() {
        this.blurEvent.emit();
        this.onTouched();
        this.cdr.detectChanges();
    }

    public onFocus() {
        this.focusEvent.emit();
        //this.onTouched();
    }

    public onClick(event: any) {
        this.click.emit(event);
        this.onTouched();
    }

    public onKeyup(event: any) {
        this.keyup.emit(event);
    }

    public onKeydown(event: any) {
        this._onlyOnInit = false;
        this.keydown.emit(event);
    }

    public onChange(value: CompleterItem | string) {
        this.value = value;
    }

    public open() {
        this.completer.open();
    }

    public close() {
        this.completer.clear();
    }

    public focus(): void {
        if (this.ctrInput) {
            this.ctrInput.nativeElement.focus();
        } else {
            this._focus = true;
        }
    }

    public blur(): void {
        if (this.ctrInput) {
            this.ctrInput.nativeElement.blur();
        } else {
            this._focus = false;
        }
    }

    public isOpen() {
        return this._open;
    }
}
