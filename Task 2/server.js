import express from 'express';
import routes from './routes.js'; 

const app = express();
app.use(express.json());
app.use('/', routes);

app.get('/', (req, res) => {
  res.send('Conference Room Booking API is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
