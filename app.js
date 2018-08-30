import express from 'express';
import path from 'path';
import config from 'config';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/client/dist/'), {index: false}));

app.get('/', function(req, res) {
  if (req.query.apiKey == config.get('app.apiKey')) {
    res.sendFile(path.join(__dirname + '/client/dist/index.html'));
  } else {
    res.sendStatus(401);
  }
});

export default app;
