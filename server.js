const express = require('express');
const mongoose = require('mongoose');
const Event = require('./models/Event'); // Ihr Event-Modell
const path = require('path');
const app = express();

mongoose.connect('mongodb://mongo:27017/open-flair', { useNewUrlParser: true, useUnifiedTopology: true });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

// Funktion zum Gruppieren und Sortieren der Events nach Datum und Uhrzeit
function groupAndSortEventsByDate(events) {
  const groupedEvents = events.reduce((grouped, event) => {
    const date = event.date;
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(event);
    return grouped;
  }, {});

  // Sortiere die Events nach Uhrzeit
  Object.keys(groupedEvents).forEach(date => {
    groupedEvents[date].sort((a, b) => {
      if (a.time === 'n.a.' || b.time === 'n.a.') return 0;
      return a.time.localeCompare(b.time);
    });
  });

  return groupedEvents;
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
    const eventsGroupedByDate = groupAndSortEventsByDate(events);
    res.render('timetable', { eventsGroupedByDate: eventsGroupedByDate || {} });
  }).catch(error => {
    console.error(error);
    res.status(500).send('Internal Server Error');
  });
});

app.get('/timetable', (req, res) => {
  Event.find().then(events => {
    const eventsGroupedByDate = groupAndSortEventsByDate(events);
    res.render('timetable', { eventsGroupedByDate: eventsGroupedByDate || {} });
  }).catch(error => {
    console.error(error);
    res.status(500).send('Internal Server Error');
  });
});

// Route für die Admin-Seite
app.get('/admin', (req, res) => {
  Event.find().then(events => {
    res.render('admin', { events });
  });
});

// Route für ein einzelnes Event
app.get('/admin/events/:id', (req, res) => {
  Event.findById(req.params.id).then(event => {
    res.json(event);
  }).catch(err => {
    res.status(404).send('Event not found');
  });
});

// CRUD Routes
app.post('/admin/events', (req, res) => {
  const event = new Event(req.body);
  event.save().then(() => res.redirect('/admin'));
});

app.put('/admin/events/:id', (req, res) => {
  Event.findByIdAndUpdate(req.params.id, req.body).then(() => res.redirect('/admin'));
});

app.delete('/admin/events/:id', (req, res) => {
  Event.findByIdAndDelete(req.params.id).then(() => res.redirect('/admin'));
});


  // Routes
  app.get('/', (req, res) => {
    Event.find().then(events => {
      const eventsGroupedByDate = groupEventsByDate(events);
      res.render('timetable', { eventsGroupedByDate });
    });
  });


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
