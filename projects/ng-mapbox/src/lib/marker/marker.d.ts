import { EventEmitter } from '@angular/core';
import { MapboxEvent } from 'mapbox-gl';

/**
 * Mapbox Layer Events Interface
 */
export interface MarkerEvents {

  /**
   * Mapbox Marker Drag Events
   */
  dragStart: EventEmitter<MapboxEvent<MouseEvent | TouchEvent | undefined>>;
  drag: EventEmitter<MapboxEvent<MouseEvent | TouchEvent | undefined>>;
  dragEnd: EventEmitter<MapboxEvent<MouseEvent | TouchEvent | undefined>>;

}
