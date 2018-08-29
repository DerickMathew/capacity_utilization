import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/client/dist/')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + 'index.html'));
});

export default app;
