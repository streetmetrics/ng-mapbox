import { Injectable } from '@angular/core';
import { Control } from 'mapbox-gl';
import { SMControl } from '../abstract';
import { OptionsWithControls } from '../map/map';
import { ControlPosition } from './control';
import { isNil } from 'lodash';

declare const mapboxgl;

@Injectable()
export class MapControlService {

  private map: mapboxgl.Map;

  private readonly loadedControls: Control[] = [];

  constructor() {
  }

  /**
   * Initialize service with created Map and add global/locally added Controls
   * @param map - the Mapbox Map instance
   * @param options - global/Map options with control configuration
   */
  init(map: mapboxgl.Map, options: Partial<OptionsWithControls>): void {
    this.map = map;
    ([...(options.controls || []), ...this.loadedControls]).forEach(control => this.addControl(control, options.controlPosition));
  }

  /**
   * Add already instantiated Control (or SMControl instance) to Map instance
   * @param control - the Control or SMControl instance
   * @param position - where on the Map instance to place this Control
   * @param replace - whether or not this Control should replace existing instance of Control type
   */
  addControl(control: Control | SMControl<any>, position: ControlPosition, replace = false): Control {
    const newControl: Control = control instanceof Control ? control : control.buildControl();
    if (isNil(newControl) || !(newControl instanceof Control)) {
      throw new Error('Invalid Control passed to MapControlService');
    }
    if (replace) {
      this.replaceExistingControl(newControl);
    }
    this.loadedControls.push(newControl);
    if (this.map) {
      this.map.addControl(newControl, position);
    }
    return newControl;
  }

  /**
   * Remove Control from the Map
   * @param control - the Control to remove
   */
  removeControl(control: Control): void {
    if (this.map) {
      this.map.removeControl(control);
    }
  }

  /**
   * Find (if exists) and replace existing Control from the Map instance
   * @param newControl - the Control replacing the existing instance
   * @private
   */
  private replaceExistingControl(newControl: Control): void {
    const existingIndex = this.loadedControls.findIndex(control => control.constructor === newControl.constructor);
    if (existingIndex > -1) {
      this.removeControl(this.loadedControls[existingIndex]);
      this.loadedControls.splice(existingIndex, 1);
    }
  }
}
