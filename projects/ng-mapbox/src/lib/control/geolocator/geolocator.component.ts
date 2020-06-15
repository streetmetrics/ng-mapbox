import { Component, ChangeDetectionStrategy, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { LngLatBoundsLike } from 'mapbox-gl';
import { ReflectionHelper } from '../../helpers';
import { ControlPosition } from '../control';
import { MapControlService } from '../control.service';
import { GeolocatorControlOptions } from './geolocator';
import { SMGeolocatorControl } from './geolocator.control';

@Component({
  selector: 'sm-geolocator',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeolocatorControlComponent implements AfterViewInit, OnDestroy, GeolocatorControlOptions {

  /* Static Inputs */
  @Input() accessToken: string;
  @Input() bbox: LngLatBoundsLike;
  @Input() clearAndBlurOnEsc: boolean;
  @Input() clearOnBlur: boolean;
  @Input() collapsed: boolean;
  @Input() countries: string;
  @Input() enableEventLogging: boolean;
  @Input() filter: (feature: any) => boolean;
  @Input() flyTo: boolean;
  @Input() getItemValue: (feature: any) => string;
  @Input() language: string;
  @Input() limit: number;
  @Input() localGeocoder: (query: string) => any;
  @Input() localGeocoderOnly: boolean;
  @Input() mapboxgl: any;
  @Input() marker: boolean;
  @Input() minLength: number;
  @Input() mode: 'mapbox.places' | 'mapbox.places-permanent';
  @Input() origin: string;
  @Input() placeholder: string;
  @Input() proximity: object;
  @Input() reverseGeocode: boolean;
  @Input() reverseMode: 'distance' | 'score';
  @Input() trackProximity: boolean;
  @Input() zoom: number;
  @Input() render: (feature: any) => string;

  /* Custom Inputs */
  @Input() position?: ControlPosition;
  @Input() replaceGlobal = true;

  // TODO Better typings for Inputs and register @Outputs()

  private control: SMGeolocatorControl;

  constructor(private controlService: MapControlService) {
  }

  ngAfterViewInit(): void {
    const options: any = ReflectionHelper.getInputs(this, ['replaceGlobal']);
    this.control = new SMGeolocatorControl(options);
    this.controlService.addControl(this.control, this.position, true);
  }

  ngOnDestroy(): void {
    this.controlService.removeControl(this.control.control);
  }
}
