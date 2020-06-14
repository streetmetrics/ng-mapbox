import { EventEmitter } from '@angular/core';
import { chain, isNil, omitBy, get } from 'lodash';

/**
 * Helper utility class to assist in retrieving ngMetadata from Components
 */
export class ReflectionHelper {

  /**
   * Get all @Output() properties from a Component that have listeners
   * @param component - the Component to scan for @Output() properties
   */
  static getActiveOutputs<T>(component: any): Partial<T> {
    const emitters: Record<string, string> = get(component, 'constructor.ɵcmp.outputs', {});
    const outputs = chain(emitters)
      .transform((accum, key) => accum[key] = component[key], {})
      .pickBy((emitter: EventEmitter<any>) => emitter instanceof EventEmitter && !!emitter.observers.length)
      .value();
    return outputs;
  }

  /**
   * Retrieve @Input()s with values from Component
   * @param component - the Component to scan for @Input() properties
   * @param omit - properties to omit
   * @param extra - extra data to append to the output object
   */
  static getInputs<T>(component: any, omit: string[] = [], extra: Record<string, any> = {}): Partial<T> {
    const properties: Record<string, string> = get(component, 'constructor.ɵcmp.inputs', {});
    const inputs: Partial<T> = chain(properties)
      .omitBy(key => omit.includes(key))
      .transform((accum, componentKey, key) => accum[key] = component[componentKey], {})
      .omitBy(isNil)
      .value();
    return omitBy<Partial<T>>({ ...extra, ...inputs }, isNil);
  }
}
