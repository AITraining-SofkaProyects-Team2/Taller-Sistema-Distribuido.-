export class TicketNotFoundError extends Error {
  constructor() {
    super('Ticket no encontrado');
    this.name = 'TicketNotFoundError';
  }
}
