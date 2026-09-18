import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to the Pioneer Valley Tennis Matchmaker</h1>
    <p>Find local hitting partners and track court availability in the Pioneer Valley Area.</p>
    <p>Head over to <code>/players</code> to find a match.</p>
  `);
});

app.get("/Listings", (req, res) => {
  res.send("This is where tennis matches near you will likely go!")
});

app.use((req, res) => {
  res.status(404).send('Page not found.');
});

app.listen(port, () => {
  console.log(`Matchmaker server is running at http://localhost:${port}`);
});
