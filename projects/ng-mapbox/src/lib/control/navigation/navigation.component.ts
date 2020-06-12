import { Component, ChangeDetectionStrategy, OnDestroy, AfterContentInit, Optional, Input } from '@angular/core';
import { Control } from 'mapbox-gl';
import { ConfigurableMapComponent } from '../../abstract';
import { MapComponent } from '../../map/map.component';

declare const mapboxgl;

@Component({
  selector: 'sm-navigation-control',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationControlComponent extends ConfigurableMapComponent<mapboxgl.NavigationControl> implements AfterContentInit, OnDestroy {

  /* Static Inputs */
  @Input() position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  @Input() showCompass: boolean;
  @Input() showZoom: boolean;
  @Input() visualizePitch: boolean;

  private control: Control;

  constructor(@Optional() protected mapComponent: MapComponent) {
    super(mapComponent);
  }

  ngAfterContentInit(): void {
    this.mapComponent.mapCreated$.subscribe((map) => {
      const options = this.assemble(['position']);
      this.control = new mapboxgl.NavigationControl(options);
      map.addControl(this.control, this.position);
    });
  }

  ngOnDestroy(): void {
    this.mapInstance.removeControl(this.control);
  }
}
