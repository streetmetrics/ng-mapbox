import { ModuleWithProviders, NgModule } from '@angular/core';
import { MapboxOptions } from 'mapbox-gl';
import { GLOBAL_MAP_OPTIONS } from './constants';
import { MapComponent } from './map/map.component';
import { LayerComponent } from './layer/layer.component';
import { MarkerComponent } from './marker/marker.component';
import { PopupDirective } from './marker/popup.directive';
import { ImageComponent } from './image/image.component';
import { VectorSourceComponent } from './source/vector.component';
import { GeoJSONComponent } from './source/geojson.component';
import { BoundsComponent } from './bounds/bounds.component';

const EXPORT_COMPONENTS = [
  MapComponent,
  BoundsComponent,
  GeoJSONComponent,
  ImageComponent,
  LayerComponent,
  MarkerComponent,
  PopupDirective,
  VectorSourceComponent,
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
