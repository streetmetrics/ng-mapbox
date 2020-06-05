import { ModuleWithProviders, NgModule } from '@angular/core';
import { MapboxOptions } from 'mapbox-gl';
import { GLOBAL_MAP_OPTIONS } from './constants';
import { MapComponent } from './map/map.component';

const EXPORT_COMPONENTS = [
  MapComponent,
];

@NgModule({
  declarations: [
    ...EXPORT_COMPONENTS,
  ],
  exports: [
    ...EXPORT_COMPONENTS,
  ],
})
export class SmMapboxModule {

  static forRoot(options: Omit<MapboxOptions, 'container'>): ModuleWithProviders {
    return {
      ngModule: SmMapboxModule,
      providers: [
        {
          provide: GLOBAL_MAP_OPTIONS,
          useValue: options,
        },
      ],
    };
  }
}
