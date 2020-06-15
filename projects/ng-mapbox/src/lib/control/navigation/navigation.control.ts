import { SMControl } from '../../abstract';
import { NavigationControlOptions } from './navigation';
import { omitBy, isNil } from 'lodash';

declare const mapboxgl;

/**
 * Navigation Control class
 */
export class SMNavigationControl extends SMControl<NavigationControlOptions> {

  constructor(private options: NavigationControlOptions = {}) {
    super();
  }

  buildControl(): mapboxgl.NavigationControl {
    this.control = new mapboxgl.NavigationControl(omitBy(this.options, isNil));
    return this.control;
  }
}
