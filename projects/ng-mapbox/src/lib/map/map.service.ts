import { Inject, Injectable, Optional } from '@angular/core';
import { isNil, omitBy, forIn } from 'lodash';
import { AnyPaint, Layer, MapboxOptions } from 'mapbox-gl';
import { AsyncSubject, Observable } from 'rxjs';
import { GLOBAL_MAP_OPTIONS } from '../constants';
import { MapboxEvents, SetupOptions } from './map';

declare const mapboxgl;

@Injectable()
export class MapService {

  private map: mapboxgl.Map;

  private mapCreated$ = new AsyncSubject<void>();
  private mapLoaded$ = new AsyncSubject<mapboxgl.Map>();

  get mapCreated(): Observable<void> {
    return this.mapCreated$.asObservable();
  }

  get mapLoaded(): Observable<mapboxgl.Map> {
    return this.mapLoaded$.asObservable();
  }

  constructor(@Optional() @Inject(GLOBAL_MAP_OPTIONS) private readonly globalOptions: Omit<MapboxOptions, 'container'>) {
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
   * Add Layer to Map instance
   * @param layer - the Layer configuration to add
   */
  addLayer(layer: Layer): void {
    this.map.addLayer(layer);
  }

  /**
   * Update Layer filter
   * @param id - the ID of the Layer to filter
   * @param filter - filter args
   */
  setLayerFilter(id: string, filter: any): void {
    this.map.setFilter(id, filter);
  }

  /**
   * Update Layer Paint
   * @param id - the ID of the Layer to update
   * @param paint - the new Paint args
   */
  setLayerPaint(id: string, paint: AnyPaint): void {
    forIn(paint, (value, key) => this.map.setPaintProperty(id, key, value));
  }

  /**
   * Update Layer zoom range
   * @param id - the ID of the Layer to update
   * @param minZoom - the minimum zoom range value
   * @param maxZoom - the maximum zoom range value
   */
  setLayerZoomRange(id: string, minZoom: number, maxZoom: number): void {
    this.map.setLayerZoomRange(id, minZoom, maxZoom);
  }

  /**
   * Setup MapService with options from MapComponent
   * Use global options provided in SmMapboxModule.forRoot()
   *
   * @param options - MapboxOptions and MapboxEvents
   */
  setup(options: SetupOptions): void {
    const mapOptions = { ...this.globalOptions, ...options.options };
    if (!mapOptions.accessToken) {
      throw new Error('Mapbox Access Token not provided!');
    }
    Object.getOwnPropertyDescriptor(mapboxgl, 'accessToken').set(mapOptions.accessToken);
    this.map = new mapboxgl.Map(omitBy(mapOptions, isNil));
    this.registerEvents(options.events);
  }

  /**
   * Register Map load/create events and setup EventManager
   * @param events - MapboxEvents object passed from MapComponent
   * @private
   */
  private registerEvents(events: MapboxEvents): void {
    this.mapCreated$.next();
    this.mapCreated$.complete();
    this.map.once('load', () => {
      this.mapLoaded$.next(this.map);
      this.mapLoaded$.complete();
    });
    forIn(events, (emitter, event: keyof MapboxEvents) => {
      if (emitter.observers.length) {
        this.map.on(MapService.getEventType(event), (mapboxEvent: any) => emitter.emit(mapboxEvent));
      }
    });
  }
}
