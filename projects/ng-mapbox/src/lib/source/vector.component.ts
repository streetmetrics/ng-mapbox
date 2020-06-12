import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges, Optional, OnDestroy } from '@angular/core';
import { PromoteIdSpecification, VectorSource } from 'mapbox-gl';
import { ConfigurableMapComponent } from '../abstract';
import { ChangesHelper } from '../helpers';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'sm-vector-source',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VectorSourceComponent extends ConfigurableMapComponent<VectorSource> implements OnInit, OnChanges, OnDestroy, VectorSource {

  /* Static Inputs */
  @Input() id: string;

  /* Dynamic Inputs */
  @Input() attribution: string;
  @Input() bounds: number[];
  @Input() maxzoom: number;
  @Input() minzoom: number;
  @Input() promoteId: PromoteIdSpecification;
  @Input() scheme: 'xyz' | 'tms';
  @Input() tiles: string[];
  @Input() url: string;

  /* (Static) Config Input used with/instead of individual properties */
  @Input() config: Omit<VectorSource, 'type'> = {};

  readonly type = 'vector';

  constructor(@Optional() protected mapComponent: MapComponent) {
    super(mapComponent);
  }

  ngOnInit(): void {
    this.mapComponent.mapLoaded$.subscribe(map => this.addSource(map));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.mapInstance.getSource(this.id)) {
      return;
    }
    if (ChangesHelper.hasOneChange(changes, ['attribution', 'bounds', 'maxzoom', 'minzoom', 'promoteId', 'scheme', 'tiles', 'url'])) {
      this.ngOnDestroy();
      this.ngOnInit();
    }
  }

  ngOnDestroy() {
    if (!!this.mapInstance.getSource(this.id)) {
      this.mapInstance.removeSource(this.id);
    }
  }

  /**
   * Assemble Source from @Inputs and add it to Map
   * @param map - the Mapbox Map to add this Source to
   * @private
   */
  private addSource(map: mapboxgl.Map): void {
    const options = this.assemble(['id']);
    map.addSource(this.id, { ...options, type: this.type });
  }
}
