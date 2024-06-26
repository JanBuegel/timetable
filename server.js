const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

mongoose.connect('mongodb://mongo:27017/open-flair', { useNewUrlParser: true, useUnifiedTopology: true });

const Event = require('./models/Event');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

// Funktion zum Gruppieren der Events nach Datum
function groupEventsByDate(events) {
  return events.reduce((grouped, event) => {
    const date = event.date;
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(event);
    return grouped;
  }, {});
}

// Route für die Bühne-Liste
app.get('/stages', (req, res) => {
  Event.distinct('stage').then(stages => {
    res.json(stages.filter(stage => stage && stage !== 'n.a.'));
  });
});

// Routes
app.get('/', (req, res) => {
  Event.find().then(events => {
    const eventsGroupedByDate = groupEventsByDate(events);
    res.render('index', { eventsGroupedByDate });
  });
});

app.get('/timetable', (req, res) => {
  Event.find().then(events => {
    const eventsGroupedByDate = groupEventsByDate(events);
    res.render('timetable', { eventsGroupedByDate });
  });
});

app.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});
