/**
 * This class is used while rejecting a promise
 */
export class Reject {
  code: number;
  msg: string;

  constructor(code: number, msg: string) {
    this.code = code;
    this.msg = msg;
  }

  public toString = (): string => {
    return `Reject[code: ${this.code}, msg: ${this.msg}]`;
  }

}
