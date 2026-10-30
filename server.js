import 'dotenv/config';
import express from 'express';
import profilesRouter from './routes/profiles.js';
import { connectDB } from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.json()); 

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/profiles', (req, res) => {
  res.render('profiles');
});

app.get("/Matches", (req, res) => {
  res.send("This is where tennis matches near you will go on.");
});

app.use('/api/profiles', profilesRouter);

app.use((req, res) => {
  res.status(404).send('Page not found.');
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Matchmaker server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Could not connect to MongoDB:', err.message);
    process.exit(1);
  });