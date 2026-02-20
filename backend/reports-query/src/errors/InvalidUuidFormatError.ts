export class InvalidUuidFormatError extends Error {
  constructor() {
    super('Formato de ID inválido');
    this.name = 'InvalidUuidFormatError';
  }
}
