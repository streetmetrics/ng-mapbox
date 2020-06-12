import { EventEmitter } from '@angular/core';
import { chain, get, isNil, omitBy, pickBy } from 'lodash';

/**
 * Decorator Invocation model for decorator properties on a Component
 */
interface DecoratorInvocation {
  type: () => void;
  args?: any[];
}

/**
 * Helper utility class to assist in retrieving ngMetadata from Components
 */
export class ReflectionHelper {

  /**
   * Get all @Output() properties from a Component that have listeners
   * @param component - the Component to scan for @Output() properties
   */
  static getActiveOutputs<T>(component: any): Partial<T> {
    const outputs = pickBy(component, value => value instanceof EventEmitter && !!value.observers.length);
    return outputs;
  }

  /**
   * Retrieve @Input()s with values from Component
   * @param component - the Component to scan for @Input() properties
   * @param omit - properties to omit
   * @param extra - extra data to append to the output object
   */
  static getInputs<T>(component: any, omit: string[] = [], extra: Record<string, any> = {}): Partial<T> {
    const properties: Record<string, DecoratorInvocation[]> = (component.constructor as any).propDecorators;
    const inputs: Partial<T> = chain(properties)
      .omit(omit)
      .reject(prop => get(prop, '[0].type.prototype.ngMetadataName') !== 'Input')
      .transform((accum, value, key) => accum[get(value, '[0].args[0]') || key] = this[key], {})
      .value();
    return omitBy<Partial<T>>({ ...extra, ...inputs }, isNil);
  }
}
