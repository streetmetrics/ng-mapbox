import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges, OnDestroy,
  Optional,
  Output, SimpleChanges,
  ViewChild,
} from '@angular/core';
import { forIn, upperFirst } from 'lodash';
import {
  ErrorEvent,
  LngLatBoundsLike,
  LngLatLike,
  MapboxEvent,
  MapboxOptions, MapBoxZoomEvent,
  MapContextEvent,
  MapDataEvent,
  MapMouseEvent,
  MapSourceDataEvent,
  MapStyleDataEvent,
  MapTouchEvent,
  MapWheelEvent,
  Style,
} from 'mapbox-gl';
import { AsyncSubject } from 'rxjs';
import { GLOBAL_MAP_OPTIONS } from '../constants';
import { ChangesHelper, ReflectionHelper } from '../helpers';
import { MapboxEvents, OptionsWithControls } from './map';

declare const mapboxgl;

@Component({
  selector: 'sm-map',
  template: '<div #container><ng-content select="[map-content]"></ng-content></div>',
  styles: [
    ':host { display: block; height: 100%; width: 100%; }',
    'div { height: 100%; width: 100% }',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements AfterViewInit, OnChanges, OnDestroy, OptionsWithControls, MapboxEvents {

  /* Static Input Variables */
  @Input() accessToken: string;
  @Input() antialias?: boolean;
  @Input() attributionControl?: boolean;
  @Input() bearingSnap?: number;
  @Input() clickTolerance?: number;
  @Input() collectResourceTiming?: boolean;
  @Input() crossSourceCollisions?: boolean;
  @Input() customAttribution?: string | string[];
  @Input() fadeDuration?: number;
  @Input() failIfMajorPerformanceCaveat?: boolean;
  @Input() hash?: boolean | string;
  @Input() interactive?: boolean;
  @Input() localIdeographFontFamily?: string;
  @Input() locale?: { [p: string]: string };
  @Input() logoPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  @Input() maxTileCacheSize?: number;
  @Input() maxPitch?: number;
  @Input() minPitch?: number;
  @Input() pitchWithRotate?: boolean;
  @Input() preserveDrawingBuffer?: boolean;
  @Input() refreshExpiredTiles?: boolean;
  @Input() renderWorldCopies?: boolean;
  @Input() touchPitch?: boolean;
  @Input() trackResize?: boolean;

  /* Dynamic Inputs */
  @Input() bearing?: number;
  @Input() boxZoom?: boolean;
  @Input() center?: LngLatLike;
  @Input() doubleClickZoom?: boolean;
  @Input() dragPan?: boolean;
  @Input() dragRotate?: boolean;
  @Input() keyboard?: boolean;
  @Input() maxBounds?: LngLatBoundsLike;
  @Input() maxZoom?: number;
  @Input() minZoom?: number;
  @Input() pitch?: number;
  @Input() scrollZoom?: boolean;
  @Input() style?: Style | string;
  @Input() touchZoomRotate?: boolean;
  @Input() zoom?: number;

  /* Custom Inputs */
  @Input() controlPosition: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

  /* (Static) Config Input used with/instead of individual properties */
  @Input() config?: OptionsWithControls;

  /* Map Container */
  @ViewChild('container', { static: true, read: ElementRef }) container: ElementRef | any;

  /* Mapbox Event Outputs */
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

  /** Mapbox Map instance */
  public map: mapboxgl.Map;

  /** Map Ready Events */
  public readonly mapCreated$ = new AsyncSubject<mapboxgl.Map>();
  public readonly mapLoaded$ = new AsyncSubject<mapboxgl.Map>();

  constructor(@Optional() @Inject(GLOBAL_MAP_OPTIONS) private readonly globalOptions: OptionsWithControls) {
  }

  ngAfterViewInit(): void {
    this.setup();
  }

  ngOnChanges(changes: SimpleChanges): void {
    ChangesHelper.hasChangeEach(
      changes,
      ['bearing', 'center', 'maxBounds', 'maxZoom', 'minZoom', 'pitch', 'style', 'zoom'],
      key => this.map[`set${upperFirst(key)}`](this[key]),
    );
    ChangesHelper.hasChangeEach(
      changes,
      ['boxZoom', 'doubleClickZoom', 'dragPan', 'dragRotate', 'keyboard', 'scrollZoom', 'touchZoomRotate'],
      key => this[key] ? this.map[key].enable() : this.map[key].disable(),
    );
  }

  ngOnDestroy(): void {
    this.map.remove();
  }

  /**
   * Bind Map Events from @Outputs
   * @private
   */
  private bindEvents(): void {
    const events = ReflectionHelper.getActiveOutputs<MapboxEvents>(this);
    forIn(events, (emitter, event: any) => this.map.on(event, mapboxEvent => emitter.emit(mapboxEvent)));
  }

  /**
   * Setup Mapbox Map from Global options and @Input() properties
   * @private
   */
  private setup(): void {
    const options = ReflectionHelper.getInputs<OptionsWithControls>(this, ['config'], { ...this.globalOptions, ...this.config });
    this.map = new mapboxgl.Map({ ...options, container: this.container.nativeElement });
    this.mapCreated$.next(this.map);
    this.mapCreated$.complete();
    (options.controls || []).forEach(control => this.map.addControl(control, options.controlPosition));
    this.map.on('load', () => {
      this.mapLoaded$.next(this.map);
      this.mapLoaded$.complete();
      this.bindEvents();
    });
  }
}
