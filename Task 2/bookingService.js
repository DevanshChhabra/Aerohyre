import { randomUUID } from 'crypto';

class BookingService{
  constructor() {
    this.bookings = new Map(); // key: booking ID
  }

    createBooking({ room, start, end }){
        this.validateTime(start, end);
        if (this.hasConflict(room, start, end)) {
            throw new Error('Booking conflict');
        }
        const id = randomUUID();
        this.bookings.set(id, { id, room, start: new Date(start), end: new Date(end) });
        return this.bookings.get(id);
    }

    listFreeSlots(date) {
    const allHours = Array.from({ length: 24 }, (_, i) => i);
    const occupied = new Set();

    for (const { start, end } of this.bookings.values()) {
        const bookingDate = start.toISOString().slice(0, 10); // to get date portion only

        if (bookingDate === date) {
        const startHour = start.getUTCHours();  
        const endHour = end.getUTCHours();
            for (let h = startHour; h < endHour; h++) {
                occupied.add(h);
            }
        }
    }

    return allHours.filter(h => !occupied.has(h));
    }


    rescheduleBooking(id, newStart, newEnd){
    if (!this.bookings.has(id)) throw new Error('Booking not found');
    const booking = this.bookings.get(id);
    this.validateTime(newStart, newEnd);

    //Temporarily removing booking to check conflict
    this.bookings.delete(id);
    if (this.hasConflict(booking.room, newStart, newEnd)) {
        this.bookings.set(id, booking);
        throw new Error('Booking conflict');
    }

    booking.start = new Date(newStart);
    booking.end = new Date(newEnd);
    this.bookings.set(id, booking);
    return booking;
    }

    cancelBooking(id){
    if (!this.bookings.has(id)) throw new Error('Booking not found');
    this.bookings.delete(id);
    }

    hasConflict(room, start, end){
    const newStart = new Date(start), newEnd = new Date(end);
    for (const b of this.bookings.values()) {
        if (b.room === room &&
            !(newEnd <= b.start || newStart >= b.end)) {
        return true;
        }
    }
    return false;
    }

    validateTime(start, end) {
        const s = new Date(start), e = new Date(end);
        if (isNaN(s) || isNaN(e)) throw new Error('Invalid date');
        if (s >= e) throw new Error('Invalid time range');
    }
}

const instance = new BookingService();
export default instance;
