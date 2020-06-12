import { Component, OnInit, ChangeDetectionStrategy, Input, OnDestroy, OnChanges, SimpleChanges, Optional } from '@angular/core';
import { ConfigurableMapComponent } from '../abstract';
import { ChangesHelper } from '../helpers';
import { MapComponent } from '../map/map.component';

declare const mapboxgl;

type Image = HTMLImageElement | ArrayBufferView | { width: number; height: number; data: Uint8Array | Uint8ClampedArray } | ImageData;

@Component({
  selector: 'sm-image',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageComponent extends ConfigurableMapComponent<any> implements OnInit, OnChanges, OnDestroy {

  /* Static Inputs */
  @Input() name: string;

  /* Dynamic Inputs */
  @Input() image: Image;
  @Input() pixelRatio?: number;
  @Input() sdf?: boolean;
  @Input() url: string;

  constructor(@Optional() protected mapComponent: MapComponent) {
    super(mapComponent);
  }

  ngOnInit(): void {
    this.mapComponent.mapLoaded$.subscribe(map => this.init(map));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (ChangesHelper.hasOneChange(changes, ['image', 'pixelRatio', 'sdf', 'url'])) {
      this.ngOnDestroy();
      this.ngOnInit();
    }
  }

  ngOnDestroy(): void {
    if (this.mapInstance.hasImage(this.name)) {
      this.mapInstance.removeImage(this.name);
    }
  }

  /**
   * Load image from URL or add provided image to Map
   * @param map - the Mapbox Map instance
   * @private
   */
  private async init(map: mapboxgl.Map): Promise<void> {
    if (this.image) {
      this.addImageToMap(map, this.image);
    } else if (this.url) {
      const image = await this.loadImageAsync(map, this.url);
      this.addImageToMap(map, image);
    }
  }

  /**
   * Add loaded Image to Mapbox Map
   * @param map - the Mapbox Map to add Image to
   * @param image - the (HTMLImageElement | ArrayBufferView | ImageData) Image
   * @private
   */
  private addImageToMap(map: mapboxgl.Map, image: Image): void {
    map.addImage(this.name, image, { pixelRatio: this.pixelRatio, sdf: this.sdf });
  }

  /**
   * Promisify Mapbox loadImage method
   * @param map - the Mapbox Map instance
   * @param url - URL of the Image to load
   * @private
   */
  private loadImageAsync(map: mapboxgl.Map, url: string): Promise<Image> {
    return new Promise<Image>((resolve, reject) => {
      map.loadImage(url, (err, image) => err ? reject(err) : resolve(image));
    });
  }
}
