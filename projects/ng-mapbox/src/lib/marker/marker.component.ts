import {
  Component,
  AfterViewInit,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  OnChanges,
  SimpleChanges,
  Optional,
  Output,
  EventEmitter,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { MarkerOptions, Alignment, PointLike, Anchor, LngLatLike, MapboxEvent } from 'mapbox-gl';
import { AsyncSubject } from 'rxjs';
import { ConfigurableMapComponent } from '../abstract';
import { ChangesHelper } from '../helpers';
import { MapComponent } from '../map/map.component';
import { MarkerEvents } from './marker';
import { forIn } from 'lodash';

declare const mapboxgl;

@Component({
  selector: 'sm-marker',
  template: '<div [class]="className" #container><ng-content></ng-content></div>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarkerComponent extends ConfigurableMapComponent<MarkerOptions> implements AfterViewInit,
  OnChanges,
  OnDestroy,
  MarkerOptions,
  MarkerEvents {

  /* Static Inputs */
  @Input() anchor?: Anchor;
  @Input() color?: string;
  @Input() pitchAlignment?: Alignment;
  @Input() rotation?: number;
  @Input() rotationAlignment?: Alignment;

  /* Dynamic Inputs */
  @Input() draggable?: boolean;
  @Input() offset?: PointLike;

  /* Custom Inputs */
  @Input() className: string;
  @Input() lngLat: LngLatLike;

  /* (Static) Config Input used with/instead of individual properties */
  @Input() config: MarkerOptions;

  /* Marker Container */
  @ViewChild('container', { static: true, read: ElementRef }) container: ElementRef;

  /* Marker Events */
  @Output() dragStart = new EventEmitter<MapboxEvent<MouseEvent | TouchEvent>>();
  @Output() drag = new EventEmitter<MapboxEvent<MouseEvent | TouchEvent>>();
  @Output() dragEnd = new EventEmitter<MapboxEvent<MouseEvent | TouchEvent>>();

  /* Mapbox Marker instance */
  public marker: mapboxgl.Marker;

  /* Marker Created Event */
  public readonly markerCreated$ = new AsyncSubject<mapboxgl.Marker>();

  constructor(@Optional() protected mapComponent: MapComponent) {
    super(mapComponent);
  }

  ngAfterViewInit(): void {
    this.mapComponent.mapCreated$.subscribe((map) => {
      this.addMarker(map);
      this.bindEvents();
      this.markerCreated$.next(this.marker);
      this.markerCreated$.complete();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (ChangesHelper.hasChange(changes, 'draggable')) {
      this.marker.setDraggable(this.draggable);
    }
    if (ChangesHelper.hasChange(changes, 'lngLat')) {
      this.marker.setLngLat(this.lngLat);
    }
    if (ChangesHelper.hasChange(changes, 'offset')) {
      this.marker.setOffset(this.offset);
    }
  }

  ngOnDestroy(): void {
    this.marker.remove();
  }

  /**
   * Assemble Marker from @Inputs and add it to Map
   * @param map - the Mapbox Map to add this Marker to
   * @private
   */
  private addMarker(map: mapboxgl.Map): void {
    const options = this.assemble(['className', 'lngLat']);
    options.element = this.container.nativeElement;
    this.marker = new mapboxgl.Marker(options);
    this.marker.setLngLat(this.lngLat).addTo(map);
  }

  /**
   * Bind Marker Events from @Outputs
   * @private
   */
  private bindEvents(): void {
    const events = this.getEvents<MarkerEvents>();
    forIn(events, (emitter, event) => this.marker.on(event, mapboxEvent => emitter.emit(mapboxEvent)));
  }
}
