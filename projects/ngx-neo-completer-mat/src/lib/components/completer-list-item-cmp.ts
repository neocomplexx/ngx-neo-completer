'use strict';
import {Component, Input } from '@angular/core';
import { OnInit } from '@angular/core';

export interface MatchPart {
    isMatch: boolean;
    text: string;
}

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'completer-list-item',
    // tslint:disable-next-line:max-line-length
    template: `<span class="completer-list-item-holder" [ngClass]="{'completer-title': type === 'title', 'completer-description': type === 'description'}" >
        <span class="completer-list-item" *ngFor="let part of parts" [ngClass]="part.isMatch ? matchClass : null">{{part.text}}</span>
        </span>`
})
// tslint:disable-next-line:component-class-suffix
export class CompleterListItemCmp implements OnInit {
    @Input() public text: string;
    @Input() public searchStr: string;
    @Input() public matchClass: string;
    @Input() public type: string;

    public parts: MatchPart[] = [];
    public ngOnInit() {
        if (!this.searchStr) {
            this.parts.push({ isMatch: false, text: this.text });
            return;
        }
        const matchStr = this.text.toLowerCase();
        let matchPos = matchStr.indexOf(this.searchStr.toLowerCase());
        let startIndex = 0;
        while (matchPos >= 0) {
            const matchText = this.text.slice(matchPos, matchPos + this.searchStr.length);
            if (matchPos === 0) {
                this.parts.push({ isMatch: true, text: matchText });
                startIndex += this.searchStr.length;
            } else if (matchPos > 0) {
                const matchPart = this.text.slice(startIndex, matchPos);
                this.parts.push({ isMatch: false, text: matchPart });
                this.parts.push({ isMatch: true, text: matchText });
                startIndex += this.searchStr.length + matchPart.length;
            }
            matchPos = matchStr.indexOf(this.searchStr.toLowerCase(), startIndex);
        }
        if (startIndex < this.text.length) {
             this.parts.push({ isMatch: false, text: this.text.slice(startIndex, this.text.length) });
        }
    }
}
