import { Inject, Injectable, Optional } from '@angular/core';
import { isNil, omitBy } from 'lodash';
import { MapboxOptions } from 'mapbox-gl';
import { AsyncSubject, Observable } from 'rxjs';
import { GLOBAL_MAP_OPTIONS } from '../constants';
import { EventManager } from '../helpers';
import { MapboxEvents, SetupOptions } from './map';

declare const mapboxgl;

@Injectable()
export class MapService {

  private map: mapboxgl.Map;
  private eventManager: EventManager;

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
   * Destroy Mapbox Map instance
   */
  destroy(): void {
    this.map.remove();
  }

  /**
   * Register Map load/create events and setup EventManager
   * @param events - MapboxEvents object passed from MapComponent
   * @private
   */
  private registerEvents(events: MapboxEvents): void {
    this.map.once('load', () => {
      this.mapLoaded$.next(this.map);
      this.mapLoaded$.complete();
    });
    this.eventManager = new EventManager(this.map, events);
    this.mapCreated$.next();
    this.mapCreated$.complete();
  }
}
