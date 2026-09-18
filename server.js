import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get("/Listings", (req, res) => {
  res.send("This is where tennis matches near you will likely go!")
});

app.use((req, res) => {
  res.status(404).send('Page not found.');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});