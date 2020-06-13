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
  @Input() config: Omit<Layer, 'id'>;

  /* Layer Event Outputs */
  @Output() click: EventEmitter<MapLayerMouseEvent>;
  @Output() mouseEnter: EventEmitter<MapLayerMouseEvent>;
  @Output() mouseLeave: EventEmitter<MapLayerMouseEvent>;
  @Output() mouseMove: EventEmitter<MapLayerMouseEvent>;
  @Output() dblClick: EventEmitter<MapLayerMouseEvent>;
  @Output() mouseDown: EventEmitter<MapLayerMouseEvent>;
  @Output() mouseUp: EventEmitter<MapLayerMouseEvent>;
  @Output() mouseOver: EventEmitter<MapLayerMouseEvent>;
  @Output() mouseOut: EventEmitter<MapLayerMouseEvent>;
  @Output() contextMenu: EventEmitter<MapLayerMouseEvent>;
  @Output() touchStart: EventEmitter<MapLayerTouchEvent>;
  @Output() touchEnd: EventEmitter<MapLayerTouchEvent>;
  @Output() touchCancel: EventEmitter<MapLayerTouchEvent>;

  /* Retrieve loaded Layer */
  private get layer(): Layer {
    return this.mapInstance && this.mapInstance.getLayer(this.id);
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
    if (!isNil(this.visible) && !isNil(this.layout)) {
      this.layout.visibility = this.visible && 'visible' || 'none';
    }
    const layer = this.assemble(['visible']) as Layer;
    map.addLayer(layer);
  }

  /**
   * Bind Layer Events from @Outputs
   * @param map - the Mapbox Map to listen for Layer Events on
   * @private
   */
  private bindEvents(map: mapboxgl.Map): void {
    const events = this.getEvents<LayerEvents>();
    const nameMap = { zoomChange: 'zoom', pitchChange: 'pitch' };
    forIn(events, (emitter, event: any) => map.on(
      event in nameMap && nameMap[event] || event.toLowerCase(),
      this.id, mapboxEvent => emitter.emit(mapboxEvent)),
    );
  }

  /**
   * Update all Layout or Paint properties of this Layer
   * @param type - whether we're updating Layout or Paint properties
   * @param map - the Mapbox Map this Layer belongs to
   * @private
   */
  private updateAllProperties(type: 'Layout' | 'Paint', map: mapboxgl.Map): void {
    forIn(this.layout, (value, key) => map[`set${type}Property`](this.id, key, value));
  }
}
