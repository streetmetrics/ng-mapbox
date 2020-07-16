import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Optional,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { AnyLayout, AnyPaint, AnySourceData, Layer, MapLayerMouseEvent, MapLayerTouchEvent } from 'mapbox-gl';
import { ChangesHelper } from '../helpers';
import { LayerEvents } from './layer';
import { ConfigurableMapComponent } from '../abstract';
import { MapComponent } from '../map/map.component';
import { isNil, forIn } from 'lodash';

declare const mapboxgl;

@Component({
  selector: 'sm-layer',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayerComponent extends ConfigurableMapComponent<Layer> implements OnInit, OnChanges, OnDestroy, Layer, LayerEvents {

  /* Static Inputs */
  @Input() id: string;
  @Input() source: string | AnySourceData;
  @Input() type: 'fill' | 'line' | 'symbol' | 'circle' | 'fill-extrusion' | 'raster' | 'background' | 'heatmap' | 'hillshade';
  @Input() metadata?: any;
  @Input('source-layer') sourceLayer?: string;
  @Input() interactive: boolean;
  @Input() ref: string;

  /* Dynamic Inputs */
  @Input() filter?: any[];
  @Input() layout?: AnyLayout;
  @Input() maxzoom?: number;
  @Input() minzoom?: number;
  @Input() paint?: AnyPaint;

  /* Custom Inputs */
  @Input() visible?: boolean;

  /* (Static) Config Input used with/instead of individual properties */
  @Input() config: Layer;

  /* Layer Event Outputs */
  @Output() click = new EventEmitter<MapLayerMouseEvent>();
  @Output() mouseEnter = new EventEmitter<MapLayerMouseEvent>();
  @Output() mouseLeave = new EventEmitter<MapLayerMouseEvent>();
  @Output() mouseMove = new EventEmitter<MapLayerMouseEvent>();
  @Output() dblClick = new EventEmitter<MapLayerMouseEvent>();
  @Output() mouseDown = new EventEmitter<MapLayerMouseEvent>();
  @Output() mouseUp = new EventEmitter<MapLayerMouseEvent>();
  @Output() mouseOver = new EventEmitter<MapLayerMouseEvent>();
  @Output() mouseOut = new EventEmitter<MapLayerMouseEvent>();
  @Output() contextMenu = new EventEmitter<MapLayerMouseEvent>();
  @Output() touchStart = new EventEmitter<MapLayerTouchEvent>();
  @Output() touchEnd = new EventEmitter<MapLayerTouchEvent>();
  @Output() touchCancel = new EventEmitter<MapLayerTouchEvent>();

  /* Retrieve loaded Layer */
  private get layer(): Layer {
    return this.mapInstance && this.mapInstance.getLayer(this.id);
  }

  /* Get Layout visibility value */
  private get visibility(): 'visible' | 'none' {
    return this.visible && 'visible' || 'none';
  }

  constructor(@Optional() protected mapComponent: MapComponent) {
    super(mapComponent);
  }

  ngOnInit(): void {
    this.mapComponent.mapLoaded$.subscribe((map) => {
      this.addLayer(map);
      this.bindEvents(map);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.layer) {
      return;
    }
    const map = this.mapInstance;
    if (ChangesHelper.hasChange(changes, 'visible')) {
      map.setLayoutProperty(this.id, 'visibility', this.visibility);
    }
    if (ChangesHelper.hasChange(changes, 'filter')) {
      map.setFilter(this.id, this.filter);
    }
    if (ChangesHelper.hasChange(changes, 'layout')) {
      this.updateAllProperties('Layout', map);
    }
    if (ChangesHelper.hasOneChange(changes, ['maxzoom', 'minzoom'])) {
      map.setLayerZoomRange(this.id, this.minzoom || 0, this.maxzoom || 20);
    }
    if (ChangesHelper.hasChange(changes, 'paint')) {
      this.updateAllProperties('Paint', map);
    }
  }

  ngOnDestroy(): void {
    if (!!this.layer) {
      this.mapInstance.removeLayer(this.id);
    }
  }

  /**
   * Assemble Layer from @Inputs and add it to Map
   * @param map - the Mapbox Map to add this Layer to
   * @private
   */
  private addLayer(map: mapboxgl.Map): void {
    if (!isNil(this.visible)) {
      (this.layout || (this.layout = {})).visibility = this.visibility;
    }
    const layer = this.assemble(['visible']) as Layer;
    this.id = layer.id;
    map.addLayer(layer);
  }

  /**
   * Bind Layer Events from @Outputs
   * @param map - the Mapbox Map to listen for Layer Events on
   * @private
   */
  private bindEvents(map: mapboxgl.Map): void {
    const events = this.getEvents<LayerEvents>();
    forIn(events, (emitter, event: any) => map.on(event, this.id, mapboxEvent => emitter.emit(mapboxEvent)));
  }

  /**
   * Update all Layout or Paint properties of this Layer
   * @param type - whether we're updating Layout or Paint properties
   * @param map - the Mapbox Map this Layer belongs to
   * @private
   */
  private updateAllProperties(type: 'Layout' | 'Paint', map: mapboxgl.Map): void {
    const properties = this[type.toLowerCase()];
    forIn(properties, (value, key) => map[`set${type}Property`](this.id, key, value));
  }
}
