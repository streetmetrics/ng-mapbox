import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { forIn, isNil, omitBy, pickBy } from 'lodash';
import { AnyLayout, AnyPaint, AnySourceData, Layer, MapLayerMouseEvent, MapLayerTouchEvent } from 'mapbox-gl';
import { MapService } from '../map/map.service';
import { LayerEvents } from './layer';

declare const mapboxgl;

@Component({
  selector: 'sm-layer',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayerComponent implements OnInit, OnChanges, Layer, LayerEvents {

  /* Static Inputs */
  @Input() id: string;
  @Input() source: string | AnySourceData;
  @Input() type: 'fill' | 'line' | 'symbol' | 'circle' | 'fill-extrusion' | 'raster' | 'background' | 'heatmap' | 'hillshade';
  @Input() metadata?: any;
  @Input() sourceLayer?: string;
  @Input() interactive: boolean;
  @Input() ref: string;

  /* Dynamic Inputs */
  @Input() filter?: any[];
  @Input() layout?: AnyLayout;
  @Input() maxzoom?: number;
  @Input() minzoom?: number;
  @Input() paint?: AnyPaint;

  /* Custom Inputs */
  @Input() visible: boolean;

  /**
   * Layer config Input to be used instead of individual property Input(s)
   */
  @Input() config: Layer;

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

  /* Whether or not the Layer has been added to the Map */
  private isLoaded = false;

  /* Get Layer visibility Layout value */
  private get visibility(): 'visible' | 'none' {
    return this.visible && 'visible' || 'none';
  }

  constructor(private service: MapService) {
  }

  ngOnInit(): void {
    this.service.mapLoaded.subscribe((map) => {
      this.service.addLayer(this.buildLayer());
      this.bindEvents(map);
      this.isLoaded = true;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.isLoaded) {
      return;
    }
    if (changes.filter && !changes.filter.isFirstChange()) {
      this.service.setLayerFilter(this.config.id || this.id, this.filter);
    }
    if (changes.paint && !changes.paint.isFirstChange()) {
      this.service.setLayerPaint(this.config.id || this.id, this.paint);
    }
    if ((changes.minzoom && !changes.minzoom.isFirstChange()) || (changes.maxzoom && !changes.maxzoom.isFirstChange())) {
      this.service.setLayerZoomRange(this.config.id || this.id, this.minzoom, this.maxzoom);
    }
  }

  /**
   * Bind Layer events and pass to @Output()
   * @param map - the Mapbox Map instance this Layer belongs to
   * @private
   */
  private bindEvents(map: mapboxgl.Map): void {
    const events = pickBy(this, value => value instanceof EventEmitter) as any as LayerEvents;
    forIn(events, (emitter, event: any | keyof LayerEvents) => {
      if (emitter.observers.length) {
        map.on(event.toLowerCase(), this.config.id || this.id, (mapboxEvent: any) => emitter.emit(mapboxEvent));
      }
    });
  }

  /**
   * Build Layer from @Input() variables and remove nil values
   * @private
   */
  private buildLayer(): Layer {
    if (!isNil(this.visible) && !isNil(this.layout)) {
      this.layout.visibility = this.visibility;
    }
    const config: Layer = {
      ...this.config,
      id: this.id,
      source: this.source,
      type: this.type,
      metadata: this.metadata,
      'source-layer': this.sourceLayer,
      interactive: this.interactive,
      ref: this.ref,
      filter: this.filter,
      layout: this.layout,
      maxzoom: this.maxzoom,
      minzoom: this.minzoom,
      paint: this.paint,
    };
    return omitBy(config, isNil) as Layer;
  }
}
