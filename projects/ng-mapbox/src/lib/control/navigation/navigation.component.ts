import { Component, ChangeDetectionStrategy, OnDestroy, AfterContentInit, Input } from '@angular/core';
import { pick } from 'lodash';
import { ControlPosition } from '../control';
import { MapControlService } from '../control.service';
import { NavigationControlOptions } from './navigation';
import { SMNavigationControl } from './navigation.control';

@Component({
  selector: 'sm-navigation-control',
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationControlComponent implements AfterContentInit, OnDestroy, NavigationControlOptions {

  /* Static Inputs */
  @Input() showCompass: boolean;
  @Input() showZoom: boolean;
  @Input() visualizePitch: boolean;

  /* Custom Inputs */
  @Input() position?: ControlPosition;
  @Input() replaceGlobal = true;

  private control: SMNavigationControl;

  constructor(private controlService: MapControlService) {
  }

  ngAfterContentInit(): void {
    const options: NavigationControlOptions = pick(this, ['showCompass', 'showZoom', 'visualizePitch']);
    this.control = new SMNavigationControl(options);
    this.controlService.addControl(this.control, this.position, true);
  }

  ngOnDestroy(): void {
    this.controlService.removeControl(this.control.control);
  }
}
