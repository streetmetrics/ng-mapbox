import { Component, OnInit, ChangeDetectionStrategy, OnChanges, SimpleChanges, Optional, Input, Inject } from '@angular/core';
import { Polygon } from 'geojson';
import { FitBoundsOptions, LngLatBoundsLike } from 'mapbox-gl';
import { ConfigurableMapComponent } from '../abstract';
import { GLOBAL_MAP_OPTIONS } from '../constants';
import { ChangesHelper } from '../helpers';
import { OptionsWithControls } from '../map/map';
import { MapComponent } from '../map/map.component';
import { some, isNil } from 'lodash';

declare const mapboxgl;

@Component({
  selector: 'sm-bounds',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoundsComponent extends ConfigurableMapComponent<FitBoundsOptions> implements OnInit, OnChanges {

  /* Static Inputs */
  @Input() static: boolean;
  @Input() checkDifferent: boolean;

  /* Dynamic Inputs */
  @Input() bounds?: Polygon | LngLatBoundsLike;
  @Input() options?: FitBoundsOptions;

  constructor(@Optional() @Inject(GLOBAL_MAP_OPTIONS) private readonly globalOptions: OptionsWithControls,
              @Optional() protected mapComponent: MapComponent) {
    super(mapComponent);
  }

  private static isSameBounds(prev: LngLatBoundsLike, next: LngLatBoundsLike): boolean {
    return JSON.stringify(prev) === JSON.stringify(next);
  }

  ngOnInit(): void {
    if (!this.bounds) {
      return;
    }
    this.mapComponent.mapLoaded$.subscribe(map => this.fitBounds(map));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.static && ChangesHelper.hasChange(changes, 'bounds')) {
      if (this.checkDifferent && BoundsComponent.isSameBounds(changes.bounds.previousValue, changes.bounds.currentValue)) {
        return;
      }
      this.fitBounds(this.mapInstance);
    }
  }

  /**
   * Fit the Map to the current bounds
   */
  fitBounds(map: mapboxgl.Map): void {
    if (!this.isValidBounds()) {
      return;
    }
    const bounds = mapboxgl.LngLatBounds.convert(this.convertPolygon());
    map.fitBounds(bounds, { ...(this.globalOptions.fitBoundsOptions || {}), ...this.options });
  }

  /**
   * Convert Polygon to LngLatBounds if not one already
   */
  private convertPolygon(): LngLatBoundsLike {
    if (!('type' in this.bounds) || this.bounds.type !== 'Polygon') {
      return this.bounds as any;
    }
    return this.bounds.coordinates.reduce((bounds, coordGroup) => {
      return coordGroup.reduce((bnds, coords) => bnds.extend(coords), bounds);
    }, new mapboxgl.LngLatBounds());
  }

  /**
   * Verify the Bounds is an array of proper values
   */
  private isValidBounds(): boolean {
    const invalid = some(this.bounds, isNil);
    return !invalid;
  }
}
