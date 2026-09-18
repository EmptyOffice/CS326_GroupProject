import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to the Pioneer Valley Tennis Matchmaker</h1>
    <p>Find local hitting partners and track court availability in the Pioneer Valley Area.</p>
    <p>Head over to <code>/Listings</code> to find a match.</p>
  `);
});

app.get("/Listings", (req, res) => {
  res.send("This is where tennis matches near you will likely go!")
});

app.use((req, res) => {
  res.status(404).send('Page not found.');
});

app.listen(PORT, () => {
  console.log(`Matchmaker server is running at http://localhost:${PORT}`);
});