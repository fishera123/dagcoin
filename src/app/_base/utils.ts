import {DatePipe} from '@angular/common';
import {environment} from '../../environments/environment';

/**
 * Class is used for utility methods,
 * For example, object merge etc.
 */

export class Utils {

  /**
   * Merges two objects. If source1 has an array property to be merged,
   * source2's items of same array are push into source1's array property.
   *
   * @param {U} source1
   * @param {V} source2
   * @returns {T}
   */
  public static merge<T, U, V>(source1: U, source2: V): T {
    const result: any = {};
    Object.assign(result, source1);
    Object.keys(source2).forEach(key => {
      if (!result.hasOwnProperty(key)) { // if result has not property
        result[key] = source2[key];
      } else if (result[key] instanceof Array) { // if result has property and property type is Array
        result[key].push(source2[key]);
      } else { // if result has property and property type not array, just set the value
        result[key] = source2[key];
      }
    });
    return result;
  };

  /**
   * convert s to number at base 10
   * @param {string} s
   * @returns {number}
   */
  public static toInt(s: string): any {
    return parseInt(s, 10);
  }

  /**
   *
   * @param {Date} date
   * @return {string} "yyyy-MM-dd" formatted string
   */
  public static dateToString(date: Date) {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'yyyy-MM-dd');
  }

  /**
   * yyyy-MM-yyT09:00:00 formated string
   * @param {string} dateStr
   * @return {Date}
   */
  public static stringToDate(dateStr: string) {
    return new Date(dateStr);
  }


  /**
   * // TODO remove, use lodash instead
   * if obj's type is string and its value is empty string return true in that case.
   * if obj's type is Array and has length = 0 returns true in that case.
   * @param obj
   * @returns {boolean}
   */
  public static isEmpty(obj: any): boolean {
    if (typeof obj === 'undefined' || obj == null) {
      return true;
    }
    if (obj === '' || (obj instanceof Array && obj.length === 0)) {
      return true;
    }
    return false;
  }

  /**
   * Compare two object by values not instances.<br>
   * Compare two objects by converting to float, If false, try converting to string.<br>
   * If each parameters isEmpty, returns true also.
   *
   * @param obj1
   * @param obj2
   * @returns {boolean}
   */
  public static equals(obj1: any, obj2: any): boolean {
    if (Utils.isEmpty(obj1) && Utils.isEmpty(obj2)) {
      return true;
    }

    let result = false;
    try {
      result = parseFloat(obj1 + '') === parseFloat(obj2 + '');
    } catch (e) {}
    if (!result) {
      result = obj1 + '' === obj2 + '';
    }
    return result;
  }

  /**
   * usage String.format('string {0}, asdad {1} ', 'var1', 'var2')
   * @return {any}
   */
  public static format(...args: any[]) {
    let s = arguments[0],
      i = 0,
      reg;
    for (; i < arguments.length - 1; i++) {
      reg = new RegExp('\\{' + i + '\\}', 'gm');
      s = s.replace(reg, arguments[i + 1]);
    }
    return s;
  }

  /* tslint:disable:no-bitwise */
  public static generateUUID() {
    let date = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const rand: number = (date + Math.random() * 16) % 16 | 0;
      date = Math.floor(date / 16);
      return (c === 'x' ? rand : (rand & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  /* tslint:enable:no-bitwise */
  public static isDate(date: any) {
    return date && Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date);
  }

  /**
   *
   * @param {Date} date
   * @return {string} yyyy/mm/dd formated string, it is the format that jackson accepts
   */
  public static formatDate(date: Date) {
    const mm = date.getMonth() + 1; // getMonth() is zero-based
    const dd = date.getDate();

    return [date.getFullYear(),
      '/',
      (mm > 9 ? '' : '0') + mm,
      '/',
      (dd > 9 ? '' : '0') + dd
    ].join('');
  }

  public static debug(message: string, ...optionalParams: any[]) {
    // TODO if prod then not log
    console.log(message, optionalParams);
  }

  public static normalizeMnemonic = (words) => {
    const isJA = words.indexOf('\u3000') > -1;
    const wordList = words.split(/[\u3000\s]+/);

    return wordList.join(isJA ? '\u3000' : ' ');
  }

  public static clearLocalStorage() {
    const ls = typeof window.localStorage !== 'undefined' ? window.localStorage : null;
    if (ls != null) {
      ls.clear();
    }
  }
}
