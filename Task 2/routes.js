import express from 'express';
import bookingService from './bookingService.js'
const router = express.Router();

// POST /bookings
router.post('/bookings',(req,res)=>{
  try{
    const booking = bookingService.createBooking(req.body);
    res.status(201).json(booking);
  } 
  catch(err){
    res.status(400).json({error:err.message });
  }
});

// GET /slots?date=YYYY-MM-DD
router.get('/slots',(req, res)=>{
  try{
    const slots = bookingService.listFreeSlots(req.query.date);
    res.json(slots);
  } 
  catch(err){
    res.status(400).json({error:err.message});
  }
});

// PUT /bookings/:id
router.put('/bookings/:id',(req, res)=>{
  try{
    const updated=bookingService.rescheduleBooking(
      req.params.id,
      req.body.start,
      req.body.end
    );
    res.json(updated);
  } 
  catch(err) {
    res.status(400).json({error:err.message});
  }
});

// DELETE /bookings/:id
router.delete('/bookings/:id',(req,res) => {
  try {
    bookingService.cancelBooking(req.params.id);
    res.status(200).json({ message: 'Booking deleted successfully' });
  } 
  catch (err) {
    res.status(404).json({error:err.message});
  }
});

export default router;
