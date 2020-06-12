import { ModuleWithProviders, NgModule } from '@angular/core';
import { GLOBAL_MAP_OPTIONS } from './constants';
import { GlobalOptions } from './map/map';
import { MapComponent } from './map/map.component';
import { LayerComponent } from './layer/layer.component';
import { MarkerComponent } from './marker/marker.component';
import { PopupDirective } from './marker/popup.directive';
import { ImageComponent } from './image/image.component';
import { VectorSourceComponent } from './source/vector.component';
import { GeoJSONComponent } from './source/geojson.component';
import { BoundsComponent } from './bounds/bounds.component';
import { NavigationControlComponent } from './control/navigation/navigation.component';

const EXPORT_COMPONENTS = [
  MapComponent,
  BoundsComponent,
  GeoJSONComponent,
  ImageComponent,
  LayerComponent,
  MarkerComponent,
  NavigationControlComponent,
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

  static forRoot(options: GlobalOptions): ModuleWithProviders {
    return {
      ngModule: SmMapboxModule,
      providers: [
        {
          provide: GLOBAL_MAP_OPTIONS,
          useValue: <GlobalOptions>{
            options: options?.options || {},
            controls: options?.controls || [],
          },
        },
      ],
    };
  }
}
