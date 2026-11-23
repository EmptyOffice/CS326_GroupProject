import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import profilesRouter from './routes/profiles.js';
import healthRouter from './routes/health.js';
import authRouter from './routes/auth.js';
import { connectDB, MONGO_URL } from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use('/health', healthRouter);

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGO_URL }),
  cookie: { httpOnly: true, sameSite: 'lax', maxAge: 1000 * 60 * 60 * 24 }
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/profiles', (req, res) => {
  res.render('profiles');
});

app.get('/signup', (req, res) => {
  if (req.session.user) return res.redirect('/profiles');
  res.render('signup');
});

app.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/profiles');
  res.render('login');
});

app.get("/Matches", (req, res) => {
  res.send("This is where tennis matches near you will go on.");
});

app.use('/api/profiles', profilesRouter);
app.use('/auth', authRouter);

app.use((req, res) => {
  res.status(404).send('Page not found.');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send('An internal server error occurred');
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
