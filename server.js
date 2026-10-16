import express from 'express';
import profilesRouter from './routes/profiles.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json()); 

app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to the Pioneer Valley Tennis Matchmaker</h1>
    <p>Find local hitting partners and track court availability in the Pioneer Valley Area.</p>
    <p>Head over to <code>/Listings</code> to find a match.</p>
  `);
});

app.get("/Matches", (req, res) => {
  res.send("This is where you will see tennis matches near you.")
});

app.use('/profiles', profilesRouter);

app.use((req, res) => {
  res.status(404).send('Page not found.');
});

app.listen(PORT, () => {
  console.log(`Matchmaker server is running at http://localhost:${PORT}`);
});