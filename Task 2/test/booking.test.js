import { expect } from 'chai';
import bookingService from '../bookingService.js'; 

describe('Booking Conflict Detection', () => {
  beforeEach(() => {
    bookingService.bookings.clear();
  });

  it('should allow non-overlapping bookings', () => {
    bookingService.createBooking({
      room: 'A', start: '2025-05-23T10:00:00Z', end: '2025-05-23T11:00:00Z'
    });

    expect(() => bookingService.createBooking({
      room: 'A', start: '2025-05-23T11:00:00Z', end: '2025-05-23T12:00:00Z'
    })).to.not.throw();
  });

  it('should reject overlapping bookings', () => {
    bookingService.createBooking({
      room: 'B', start: '2025-05-23T10:00:00Z', end: '2025-05-23T11:00:00Z'
    });

    expect(() => bookingService.createBooking({
      room: 'B', start: '2025-05-23T10:30:00Z', end: '2025-05-23T11:30:00Z'
    })).to.throw('Booking conflict');
  });

  it('should reschedule without conflict', () => {
    const booking = bookingService.createBooking({
      room: 'C', start: '2025-05-23T12:00:00Z', end: '2025-05-23T13:00:00Z'
    });

    expect(() => bookingService.rescheduleBooking(
      booking.id, '2025-05-23T13:00:00Z', '2025-05-23T14:00:00Z'
    )).to.not.throw();
  });

  it('should reject reschedule with conflict', () => {
    const b1 = bookingService.createBooking({
      room: 'D', start: '2025-05-23T14:00:00Z', end: '2025-05-23T15:00:00Z'
    });
    const b2 = bookingService.createBooking({
      room: 'D', start: '2025-05-23T15:00:00Z', end: '2025-05-23T16:00:00Z'
    });

    expect(() => bookingService.rescheduleBooking(
      b2.id, '2025-05-23T14:30:00Z', '2025-05-23T15:30:00Z'
    )).to.throw('Booking conflict');
  });
});
