import { Directive, ElementRef, Input, OnChanges, OnDestroy, Optional, SimpleChanges } from '@angular/core';
import { Anchor, PointLike, PopupOptions } from 'mapbox-gl';
import { ChangesHelper } from '../helpers';
import { MarkerComponent } from './marker.component';
import { pick, isNil, omitBy } from 'lodash';

declare const mapboxgl;

@Directive({
  selector: '[smPopup]',
})
export class PopupDirective implements PopupOptions, OnChanges, OnDestroy {

  /* Static Inputs */
  @Input() anchor?: Anchor;
  @Input() closeButton?: boolean;
  @Input() closeOnClick?: boolean;
  @Input() closeOnMove?: boolean;
  @Input() offset?: number | PointLike | { [key: string]: PointLike };

  /* Dynamic Inputs*/
  @Input() className?: string;
  @Input() maxWidth?: string;

  /* (Static) Config Input used with/instead of individual properties */
  @Input() config?: PopupOptions = {};

  private popup: mapboxgl.Popup;

  constructor(@Optional() private markerComponent: MarkerComponent, private elementRef: ElementRef) {
    if (!markerComponent) {
      throw new Error('Popup must be defined within a Marker!');
    }
    this.markerComponent.markerCreated$.subscribe(marker => this.addPopup(marker));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (ChangesHelper.hasChange(changes, 'className')) {
      this.popup.removeClassName(changes.className.previousValue);
      this.popup.addClassName(changes.className.currentValue);
    }
    if (ChangesHelper.hasChange(changes, 'maxWidth')) {
      this.popup.setMaxWidth(this.maxWidth);
    }
  }

  ngOnDestroy(): void {
    this.popup.remove();
  }

  /**
   * Add Popup to Marker instance
   * @param marker - the Marker instance to attach this Popup to
   * @private
   */
  private addPopup(marker: mapboxgl.Marker) {
    const options = pick(this, ['anchor', 'closeButton', 'closeOnClick', 'closeOnClick', 'offset', 'className', 'maxWidth']);
    this.popup = new mapboxgl.Popup(omitBy(options, isNil));
    this.popup.setDOMContent(this.elementRef.nativeElement);
    marker.setPopup(this.popup);
  }
}
