export class ClientError {
  code: any;
  message: any;

  constructor(code, message) {
    this.code = code;
    this.message = message;
  }

  public toString = (): string => {
    return `<ClientError:${this.code} ${this.message}>`;
  }

}
