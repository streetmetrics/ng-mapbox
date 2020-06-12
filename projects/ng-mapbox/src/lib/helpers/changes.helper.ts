import { SimpleChanges } from '@angular/core';

/**
 * Helper utility class to cut down on verbosity inside of ngOnChange methods
 */
export class ChangesHelper {

  /**
   * Check if SimpleChanges object has changed property
   * @param changes - SimpleChanges object from ngOnChanges method
   * @param key - the property to check for changes on
   */
  static hasChange(changes: SimpleChanges, key: string): boolean {
    return key in changes && !changes[key].isFirstChange();
  }

  /**
   * Check if SimpleChanges object has changed property/properties
   * For each value that is changed, call the callback function on that value
   * @param changes - SimpleChanges object from ngOnChanges method
   * @param keys - properties to check for changes on
   * @param callback - callback function to call for each changed property
   */
  static hasChangeEach(changes: SimpleChanges, keys: string[], callback: (key) => void): void {
    keys.forEach((key) => {
      if (this.hasChange(changes, key)) {
        callback(key);
      }
    });
  }

  /**
   * Check if SimpleChanges object has at least one property that has changed
   * @param changes - SimpleChanges object from ngOnChanges method
   * @param keys - properties to check for changes on
   */
  static hasOneChange(changes: SimpleChanges, keys: string[]): boolean {
    const index = keys.findIndex(key => this.hasChange(changes, key));
    return index !== -1;
  }
}
