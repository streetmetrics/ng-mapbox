import { EventEmitter } from '@angular/core';
import { MapLayerMouseEvent, MapLayerTouchEvent } from 'mapbox-gl';

/**
 * Mapbox Layer Events Interface
 */
export interface LayerEvents {

  /* Click Events */
  click: EventEmitter<MapLayerMouseEvent>;
  dblClick: EventEmitter<MapLayerMouseEvent>;

  /* Mouse Events */
  mouseDown: EventEmitter<MapLayerMouseEvent>;
  mouseUp: EventEmitter<MapLayerMouseEvent>;
  mouseMove: EventEmitter<MapLayerMouseEvent>;
  mouseEnter: EventEmitter<MapLayerMouseEvent>;
  mouseLeave: EventEmitter<MapLayerMouseEvent>;
  mouseOver: EventEmitter<MapLayerMouseEvent>;
  mouseOut: EventEmitter<MapLayerMouseEvent>;

  /* Context Menu Events */
  contextMenu: EventEmitter<MapLayerMouseEvent>;

  /* Touch Events */
  touchStart: EventEmitter<MapLayerTouchEvent>;
  touchEnd: EventEmitter<MapLayerTouchEvent>;
  touchCancel: EventEmitter<MapLayerTouchEvent>;

}
