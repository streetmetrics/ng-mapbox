import { LngLatBoundsLike } from 'mapbox-gl';

/**
 * GeolocatorControl configuration model
 */
export interface GeolocatorControlOptions {
  accessToken: string;
  origin?: string;
  mapboxgl?: any;
  zoom?: number;
  flyTo?: boolean;
  placeholder?: string;
  proximity?: object;
  trackProximity?: boolean;
  collapsed?: boolean;
  clearAndBlurOnEsc?: boolean;
  clearOnBlur?: boolean;
  bbox?: LngLatBoundsLike;
  countries?: string;
  minLength?: number;
  limit?: number;
  language?: string;
  filter?: (feature: any) => boolean;
  localGeocoder?: (query: string) => any;
  reverseMode?: 'distance' | 'score';
  reverseGeocode?: boolean;
  enableEventLogging?: boolean;
  marker?: boolean;
  render?: (feature: any) => string;
  getItemValue?: (feature: any) => string;
  mode?: 'mapbox.places' | 'mapbox.places-permanent';
  localGeocoderOnly?: boolean;
}
