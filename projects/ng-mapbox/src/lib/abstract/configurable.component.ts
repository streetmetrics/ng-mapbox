import { Optional } from '@angular/core';
import { ReflectionHelper } from '../helpers';
import { MapComponent } from '../map/map.component';
import { mapKeys } from 'lodash';

declare const mapboxgl;

/**
 * Class to extend for all configurable Map Components
 * Contains common methods to assist in Component setup
 */
export class ConfigurableMapComponent<T> {

  /* Config Input to be used instead of individual property Input(s) */
  config: T | Partial<T>;

  /* Get the Mapbox Map Instance */
  protected get mapInstance(): mapboxgl.Map {
    return this.mapComponent.map;
  }

  constructor(@Optional() protected mapComponent: MapComponent) {
    if (!mapComponent) {
      throw new Error(`${this.constructor.name} must be defined inside of MapComponent`);
    }
  }

  /** Assemble Mapbox Map model from @Input() properties
   * @param customKeys - array of custom keys that are handled in the Component and should be omitted
   * @protected
   */
  protected assemble(customKeys: string[] = []): Partial<T> {
    return ReflectionHelper.getInputs(this, [...customKeys, 'config'], this.config);
  }

  /**
   * Get all Mapbox Events registered on this Component
   * Only select those Events that are actively being listened to
   * @param nameMap - object mapping certain @Output() keys to other Mapbox-friendly event names
   * @protected
   */
  protected getEvents<EventMap>(nameMap: Partial<Record<keyof EventMap, string>> = {}): Partial<EventMap> {
    const outputs = ReflectionHelper.getActiveOutputs<EventMap>(this);
    return mapKeys(outputs, (_, key) => key in nameMap && nameMap[key] || key.toLowerCase()) as Partial<EventMap>;
  }
}
