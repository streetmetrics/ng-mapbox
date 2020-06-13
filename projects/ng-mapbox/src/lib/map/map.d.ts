import { EventEmitter } from '@angular/core';
import {
  Control,
  ErrorEvent,
  MapboxEvent, MapboxOptions,
  MapBoxZoomEvent,
  MapContextEvent,
  MapDataEvent,
  MapMouseEvent,
  MapSourceDataEvent,
  MapStyleDataEvent,
  MapTouchEvent,
  MapWheelEvent,
} from 'mapbox-gl';

/**
 * Global Map setup options
 */
export interface OptionsWithControls extends Omit<MapboxOptions, 'container'> {
  accessToken: string;
  controls?: Control[];
  controlPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

/**
 * Mapbox Events Interface
 */
export interface MapboxEvents {
  /**
   * Mapbox Error Event
   */
  error: EventEmitter<ErrorEvent>;

  /**
   * Generic Mapbox Events
   */
  load: EventEmitter<MapboxEvent>;
  remove: EventEmitter<MapboxEvent>;
  render: EventEmitter<MapboxEvent>;
  resize: EventEmitter<MapboxEvent>;

  /**
   * Mapbox Context Events
   */
  webglContextLost: EventEmitter<MapContextEvent>;
  webglContextRestored: EventEmitter<MapContextEvent>;

  /**
   * Mapbox Data Events
   */
  dataLoading: EventEmitter<MapDataEvent>;
  data: EventEmitter<MapDataEvent>;
  tileDataLoading: EventEmitter<MapDataEvent>;
  sourceDataLoading: EventEmitter<MapSourceDataEvent>;
  styleDataLoading: EventEmitter<MapStyleDataEvent>;
  sourceData: EventEmitter<MapSourceDataEvent>;
  styleData: EventEmitter<MapStyleDataEvent>;

  /**
   * Mapbox Box Zoom Events
   */
  boxZoomCancel: EventEmitter<MapBoxZoomEvent>;
  boxZoomStart: EventEmitter<MapBoxZoomEvent>;
  boxZoomEnd: EventEmitter<MapBoxZoomEvent>;

  /**
   * Mapbox Touch Events
   */
  touchCancel: EventEmitter<MapTouchEvent>;
  touchMove: EventEmitter<MapTouchEvent>;
  touchEnd: EventEmitter<MapTouchEvent>;
  touchStart: EventEmitter<MapTouchEvent>;

  /**
   * Mapbox Mouse Events
   */
  click: EventEmitter<MapMouseEvent>;
  contextMenu: EventEmitter<MapMouseEvent>;
  dblClick: EventEmitter<MapMouseEvent>;
  mouseMove: EventEmitter<MapMouseEvent>;
  mouseUp: EventEmitter<MapMouseEvent>;
  mouseDown: EventEmitter<MapMouseEvent>;
  mouseOut: EventEmitter<MapMouseEvent>;
  mouseOver: EventEmitter<MapMouseEvent>;

  /**
   * Mapbox Movement Events
   */
  moveStart: EventEmitter<MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined>>;
  move: EventEmitter<MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined>>;
  moveEnd: EventEmitter<MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined>>;

  /**
   * Mapbox Zoom Events
   */
  zoomStart: EventEmitter<MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined>>;
  zoomChange: EventEmitter<MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined>>;
  zoomEnd: EventEmitter<MapboxEvent<MouseEvent | TouchEvent | WheelEvent | undefined>>;

  /**
   * Mapbox Rotation Events
   */
  rotateStart: EventEmitter<MapboxEvent<MouseEvent | TouchEvent | undefined>>;
  rotate: EventEmitter<MapboxEvent<MouseEvent | TouchEvent | undefined>>;
  rotateEnd: EventEmitter<MapboxEvent<MouseEvent | TouchEvent | undefined>>;

  /**
   * Mapbox Drag Events
   */
  dragStart: EventEmitter<MapboxEvent<MouseEvent | TouchEvent | undefined>>;
  drag: EventEmitter<MapboxEvent<MouseEvent | TouchEvent | undefined>>;
  dragEnd: EventEmitter<MapboxEvent<MouseEvent | TouchEvent | undefined>>;

  /**
   * Mapbox Pitch Events
   */
  pitchStart: EventEmitter<MapboxEvent<MouseEvent | TouchEvent | undefined>>;
  pitchChange: EventEmitter<MapboxEvent<MouseEvent | TouchEvent | undefined>>;
  pitchEnd: EventEmitter<MapboxEvent<MouseEvent | TouchEvent | undefined>>;

  /**
   * Mapbox Wheel Event
   */
  wheel: EventEmitter<MapWheelEvent>;
}
