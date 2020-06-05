import { MapboxEvents } from '../map/map';
import { forIn } from 'lodash';

declare const mapboxgl;

export class EventManager {

  constructor(private map: mapboxgl.Map, private events: MapboxEvents) {
  }

  /**
   * Get Mapbox Event type from MapboxEvents object
   * @param event - the key in MapboxEvents interface
   * @private
   */
  private static getEventType(event: keyof MapboxEvents): string {
    if (event === 'zoomChange') {
      return 'zoom';
    }
    if (event === 'pitchChange') {
      return 'pitch';
    }
    return event.toLowerCase();
  }

  /**
   * Initialize EventManger for a Map and register all hooked events
   * @private
   */
  private init(): void {
    forIn(this.events, (emitter, event: keyof MapboxEvents) => {
      if (emitter.observers.length) {
        const eventType = EventManager.getEventType(event);
        this.map.on(eventType, (mapboxEvent: any) => emitter.emit(mapboxEvent));
      }
    });
  }
}
