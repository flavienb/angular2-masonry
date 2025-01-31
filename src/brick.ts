interface MutationWindow extends Window {
    MutationObserver: any;
    WebKitMutationObserver: any;
}

declare var window: MutationWindow;
declare var $:any;

import {
    Directive,
    Inject,
    ElementRef,
    forwardRef,
    OnDestroy,
    AfterViewInit
} from '@angular/core';

import { AngularMasonry } from './masonry';

@Directive({
    selector: '[masonry-brick], masonry-brick'
})
export class AngularMasonryBrick implements OnDestroy, AfterViewInit {

    constructor(
        private _element: ElementRef,
        @Inject(forwardRef(() => AngularMasonry)) private _parent: AngularMasonry
    ) { }

    ngAfterViewInit() {
        this._parent.add(this._element.nativeElement);
        if ($(this._element.nativeElement).data('uploading') == 1) {
            this.watchForHtmlChanges();
        }
    }

    ngOnDestroy() {
        this._parent.remove(this._element.nativeElement);
    }

    /** When HTML in brick changes dinamically, observe that and change layout */
    private watchForHtmlChanges(): void {
        MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

        if (MutationObserver) {
            /** Watch for any changes to subtree */
            let self = this;
            let observer = new MutationObserver(function(mutations, observerFromElement) {
                self._parent.layout();
                observer.disconnect();
            });

            // define what element should be observed by the observer
            // and what types of mutations trigger the callback
            observer.observe(this._element.nativeElement, {
                attributeFilter:['data-uploading']
            });
        }
    }
}
