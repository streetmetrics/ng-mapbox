import { isNil, omitBy } from 'lodash';
import { Control } from 'mapbox-gl';
import { SMControl } from '../../abstract';
import { GeolocatorControlOptions } from './geolocator';

declare const MapboxGeocoder;

export class SMGeolocatorControl extends SMControl<GeolocatorControlOptions> {

  constructor(private options: GeolocatorControlOptions) {
    super();
  }

  buildControl(): Control {
    this.control = new MapboxGeocoder(omitBy(this.options, isNil));
    return this.control;
  }
}
