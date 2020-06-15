import { Control } from 'mapbox-gl';

/**
 * Abstract base class for SM managed controls
 */
export abstract class SMControl<TOptions> {

  control: Control;

  abstract buildControl(): Control;

}
