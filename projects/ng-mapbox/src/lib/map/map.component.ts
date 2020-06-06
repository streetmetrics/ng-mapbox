import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  Input,
  EventEmitter,
  Output,
  OnDestroy,
} from '@angular/core';
import {
  FitBoundsOptions,
  LngLatBoundsLike,
  LngLatLike,
  MapboxOptions,
  Style,
  MapboxEvent,
  ErrorEvent,
  MapContextEvent,
  MapDataEvent,
  MapSourceDataEvent,
  MapStyleDataEvent,
  MapBoxZoomEvent,
  MapTouchEvent,
  MapMouseEvent,
  MapWheelEvent,
} from 'mapbox-gl';
import { MapService } from './map.service';
import { MapboxEvents } from './map';
import { pickBy } from 'lodash';

@Component({
  selector: 'sm-map',
  template: '<div #container><ng-content select="[map-content]"></ng-content></div>',
  styles: [
    ':host { display: block; height: 100%; width: 100%; }',
    'div { height: 100%; width: 100% }',
  ],
  providers: [MapService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements AfterViewInit, Omit<MapboxOptions, 'container'>, MapboxEvents {

  /**
   * Map Input Variables
   */
  @Input() accessToken?: string;
  @Input() antialias?: boolean;
  @Input() attributionControl?: boolean;
  @Input() bearing?: number;
  @Input() bearingSnap?: number;
  @Input() bounds?: LngLatBoundsLike;
  @Input() boxZoom?: boolean;
  @Input() center?: LngLatLike;
  @Input() clickTolerance?: number;
  @Input() collectResourceTiming?: boolean;
  @Input() crossSourceCollisions?: boolean;
  @Input() customAttribution?: string | string[];
  @Input() doubleClickZoom?: boolean;
  @Input() dragPan?: boolean;
  @Input() dragRotate?: boolean;
  @Input() fadeDuration?: number;
  @Input() failIfMajorPerformanceCaveat?: boolean;
  @Input() fitBoundsOptions?: FitBoundsOptions;
  @Input() hash?: boolean | string;
  @Input() interactive?: boolean;
  @Input() keyboard?: boolean;
  @Input() localIdeographFontFamily?: string;
  @Input() locale?: { [p: string]: string };
  @Input() logoPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  @Input() maxBounds?: LngLatBoundsLike;
  @Input() maxPitch?: number;
  @Input() maxTileCacheSize?: number;
  @Input() maxZoom?: number;
  @Input() minPitch?: number;
  @Input() minZoom?: number;
  @Input() pitch?: number;
  @Input() pitchWithRotate?: boolean;
  @Input() preserveDrawingBuffer?: boolean;
  @Input() refreshExpiredTiles?: boolean;
  @Input() renderWorldCopies?: boolean;
  @Input() scrollZoom?: boolean;
  @Input() style?: Style | string;
  @Input() touchPitch?: boolean;
  @Input() touchZoomRotate?: boolean;
  @Input() trackResize?: boolean;
  @Input() zoom?: number;

  /**
   * Mapbox Options Input to be used instead of individual property Input(s)
   */
  @Input() options?: Omit<MapboxOptions, 'container'> = {};

  /**
   * Map Container
   */
  @ViewChild('container', { static: true, read: ElementRef }) container: ElementRef;

  /**
   * Mapbox Event Outputs
   */
  @Output() error = new EventEmitter<ErrorEvent>();
  @Output() load = new EventEmitter<MapboxEvent>();
  @Output() remove = new EventEmitter<MapboxEvent>();
  @Output() render = new EventEmitter<MapboxEvent>();
  @Output() resize = new EventEmitter<MapboxEvent>();
  @Output() webglContextLost = new EventEmitter<MapContextEvent>();
  @Output() webglContextRestored = new EventEmitter<MapContextEvent>();
  @Output() dataLoading = new EventEmitter<MapDataEvent>();
  @Output() data = new EventEmitter<MapDataEvent>();
  @Output() tileDataLoading = new EventEmitter<MapDataEvent>();
  @Output() sourceDataLoading = new EventEmitter<MapSourceDataEvent>();
  @Output() styleDataLoading = new EventEmitter<MapStyleDataEvent>();
  @Output() sourceData = new EventEmitter<MapSourceDataEvent>();
  @Output() styleData = new EventEmitter<MapStyleDataEvent>();
  @Output() boxZoomCancel = new EventEmitter<MapBoxZoomEvent>();
  @Output() boxZoomStart = new EventEmitter<MapBoxZoomEvent>();
  @Output() boxZoomEnd = new EventEmitter<MapBoxZoomEvent>();
  @Output() touchCancel = new EventEmitter<MapTouchEvent>();
  @Output() touchMove = new EventEmitter<MapTouchEvent>();
  @Output() touchEnd = new EventEmitter<MapTouchEvent>();
  @Output() touchStart = new EventEmitter<MapTouchEvent>();
  @Output() click = new EventEmitter<MapMouseEvent>();
  @Output() contextMenu = new EventEmitter<MapMouseEvent>();
  @Output() dblClick = new EventEmitter<MapMouseEvent>();
  @Output() mouseMove = new EventEmitter<MapMouseEvent>();
  @Output() mouseUp = new EventEmitter<MapMouseEvent>();
  @Output() mouseDown = new EventEmitter<MapMouseEvent>();
  @Output() mouseOut = new EventEmitter<MapMouseEvent>();
  @Output() mouseOver = new EventEmitter<MapMouseEvent>();
  @Output() moveStart = new EventEmitter<MapboxEvent<MouseEvent | TouchEvent | WheelEvent>>();
  @Output() move = new EventEmitter<MapboxEvent<MouseEvent | TouchEvent | WheelEvent>>();
  @Output() moveEnd = new EventEmitter<MapboxEvent<MouseEvent | TouchEvent | WheelEvent>>();
  @Output() zoomStart = new EventEmitter<MapboxEvent<MouseEvent | TouchEvent | WheelEvent>>();
  @Output() zoomChange = new EventEmitter<MapboxEvent<MouseEvent | TouchEvent | WheelEvent>>();
  @Output() zoomEnd = new EventEmitter<MapboxEvent<MouseEvent | TouchEvent | WheelEvent>>();
  @Output() rotateStart = new EventEmitter<MapboxEvent<MouseEvent | TouchEvent>>();
  @Output() rotate = new EventEmitter<MapboxEvent<MouseEvent | TouchEvent>>();
  @Output() rotateEnd = new EventEmitter<MapboxEvent<MouseEvent | TouchEvent>>();
  @Output() dragStart = new EventEmitter<MapboxEvent<MouseEvent | TouchEvent>>();
  @Output() drag = new EventEmitter<MapboxEvent<MouseEvent | TouchEvent>>();
  @Output() dragEnd = new EventEmitter<MapboxEvent<MouseEvent | TouchEvent>>();
  @Output() pitchStart = new EventEmitter<MapboxEvent<MouseEvent | TouchEvent>>();
  @Output() pitchChange = new EventEmitter<MapboxEvent<MouseEvent | TouchEvent>>();
  @Output() pitchEnd = new EventEmitter<MapboxEvent<MouseEvent | TouchEvent>>();
  @Output() wheel = new EventEmitter<MapWheelEvent>();

  constructor(private service: MapService) {
  }

  ngAfterViewInit(): void {
    this.service.setup({
      events: pickBy(this, value => value instanceof EventEmitter) as MapboxEvents,
      options: {
        ...this.options,
        container: this.container.nativeElement,
        antialias: this.antialias,
        attributionControl: this.attributionControl,
        bearing: this.bearing,
        bearingSnap: this.bearingSnap,
        bounds: this.bounds,
        boxZoom: this.boxZoom,
        center: this.center,
        clickTolerance: this.clickTolerance,
        collectResourceTiming: this.collectResourceTiming,
        crossSourceCollisions: this.crossSourceCollisions,
        customAttribution: this.customAttribution,
        dragPan: this.dragPan,
        dragRotate: this.dragRotate,
        doubleClickZoom: this.doubleClickZoom,
        hash: this.hash,
        fadeDuration: this.fadeDuration,
        failIfMajorPerformanceCaveat: this.failIfMajorPerformanceCaveat,
        fitBoundsOptions: this.fitBoundsOptions,
        interactive: this.interactive,
        keyboard: this.keyboard,
        locale: this.locale,
        localIdeographFontFamily: this.localIdeographFontFamily,
        logoPosition: this.logoPosition,
        maxBounds: this.maxBounds,
        maxPitch: this.maxPitch,
        maxZoom: this.maxZoom,
        minPitch: this.minPitch,
        minZoom: this.minZoom,
        preserveDrawingBuffer: this.preserveDrawingBuffer,
        pitch: this.pitch,
        pitchWithRotate: this.pitchWithRotate,
        refreshExpiredTiles: this.refreshExpiredTiles,
        renderWorldCopies: this.renderWorldCopies,
        scrollZoom: this.scrollZoom,
        style: this.style,
        trackResize: this.trackResize,
        touchZoomRotate: this.touchZoomRotate,
        touchPitch: this.touchPitch,
        zoom: this.zoom,
        maxTileCacheSize: this.maxTileCacheSize,
      },
    });
  }
}
