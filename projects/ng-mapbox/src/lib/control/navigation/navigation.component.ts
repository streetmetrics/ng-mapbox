import { Component, ChangeDetectionStrategy, OnDestroy, AfterContentInit, Optional, Input, Inject } from '@angular/core';
import { Control } from 'mapbox-gl';
import { ConfigurableMapComponent } from '../../abstract';
import { GLOBAL_MAP_OPTIONS } from '../../constants';
import { OptionsWithControls } from '../../map/map';
import { MapComponent } from '../../map/map.component';
import { isNil } from 'lodash';

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

  /* Custom Inputs */
  @Input() replaceGlobal = true;

  private control: Control;

  constructor(@Optional() @Inject(GLOBAL_MAP_OPTIONS) private readonly globalOptions: OptionsWithControls,
              @Optional() protected mapComponent: MapComponent) {
    super(mapComponent);
  }

  ngAfterContentInit(): void {
    this.mapComponent.mapCreated$.subscribe((map) => {
      const options = this.assemble(['position']);
      this.control = new mapboxgl.NavigationControl(options);
      this.replaceGlobalControl();
      map.addControl(this.control, this.position);
    });
  }

  ngOnDestroy(): void {
    this.mapInstance.removeControl(this.control);
  }

  /**
   * Attempt to replace the globally configured Control of this type, if one exists
   * @private
   */
  private replaceGlobalControl(): void {
    if (!this.replaceGlobal) {
      return;
    }
    const existing = (this.globalOptions.controls || []).find(control => control instanceof mapboxgl.NavigationControl);
    if (!isNil(existing)) {
      this.mapInstance.removeControl(existing);
    }
  }
}
