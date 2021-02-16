import { Component, OnInit, ChangeDetectionStrategy, OnChanges, Input, SimpleChanges, Optional, OnDestroy } from '@angular/core';
import { Feature, FeatureCollection, Geometry } from 'geojson';
import { GeoJSONSource, GeoJSONSourceOptions } from 'mapbox-gl';
import { ConfigurableMapComponent } from '../abstract';
import { ChangesHelper } from '../helpers';
import { MapComponent } from '../map/map.component';

declare const mapboxgl;

@Component({
  selector: 'sm-geojson-source',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeoJSONComponent extends ConfigurableMapComponent<GeoJSONSourceOptions> implements OnInit, OnChanges, OnDestroy, GeoJSONSource {

  /* Static Inputs */
  @Input() attribution: string;
  @Input() id: string;

  /* Dynamic Inputs */
  @Input() buffer: number;
  @Input() cluster: number | boolean;
  @Input() clusterMaxZoom: number;
  @Input() clusterProperties: object;
  @Input() clusterRadius: number;
  @Input() data: Feature<Geometry> | FeatureCollection<Geometry> | string;
  @Input() generateId: boolean;
  @Input() lineMetrics: boolean;
  @Input() maxzoom: number;
  @Input() promoteId: mapboxgl.PromoteIdSpecification;
  @Input() tolerance: number;

  /* (Static) Config Input used with/instead of individual properties */
  @Input() config: GeoJSONSourceOptions;

  readonly type = 'geojson';

  /* Retrieve loaded Source */
  private get source(): GeoJSONSource {
    return this.mapInstance && this.mapInstance.getSource(this.id) as GeoJSONSource;
  }

  /* Get or set Source data */
  private get sourceData(): Feature<Geometry> | FeatureCollection<Geometry> | string {
    return (this.data || (this.data = { type: 'FeatureCollection', features: [] }));
  }

  constructor(@Optional() protected mapComponent: MapComponent) {
    super(mapComponent);
  }

  ngOnInit(): void {
    this.mapComponent.mapLoaded$.subscribe((map) => {
      this.addSource(map);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.source) {
      return;
    }
    if (ChangesHelper.hasOneChange(
      changes,
      ['buffer', 'cluster', 'clusterMaxZoom', 'clusterProperties', 'clusterRadius', 'generateId', 'lineMetrics', 'maxzoom', 'promoteId', 'tolerance'])
    ) {
      this.ngOnDestroy();
      this.ngOnInit();
    }
    if (ChangesHelper.hasChange(changes, 'data')) {
      this.setData(this.sourceData);
    }
  }

  ngOnDestroy(): void {
    if (!!this.source) {
      (this.mapInstance.getStyle().layers || [])
        .filter(layer => 'source' in layer ? layer.source === this.id : false)
        .forEach(layer => this.mapInstance.removeLayer(layer.id));
      this.mapInstance.removeSource(this.id);
    }
  }

  /** Methods inherited from GeoJSONSource */
  getClusterChildren(clusterId: number, callback: (error: any, features: Feature<Geometry>[]) => void): this {
    return this.source.getClusterChildren(clusterId, callback) as this;
  }

  getClusterExpansionZoom(clusterId: number, callback: (error: any, zoom: number) => void): this {
    return this.source.getClusterExpansionZoom(clusterId, callback) as this;
  }

  getClusterLeaves(clusterId: number, limit: number, offset: number, callback: (error: any, features: Feature<Geometry>[]) => void): this {
    return this.source.getClusterLeaves(clusterId, limit, offset, callback) as this;
  }

  setData(data: Feature<Geometry> | FeatureCollection<Geometry> | string): this {
    return this.source.setData(data) as this;
  }

  /**
   * Assemble Source from @Inputs and add it to Map
   * @param map - the Mapbox Map to add this Source to
   * @private
   */
  private addSource(map: mapboxgl.Map): void {
    const options = this.assemble(['id']);
    options.data = this.sourceData;
    map.addSource(this.id, { ...options, type: this.type });
  }
}
