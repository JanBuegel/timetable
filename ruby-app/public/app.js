class App extends React.Component {
  state = { events: [] };
  componentDidMount() {
    fetch('/events')
      .then(r => r.json())
      .then(events => this.setState({ events }));
  }
  render() {
    return (
      <div>
        <h1>Timetable</h1>
        <ul>
          {this.state.events.map(e => (
            <li key={e.id}>{e.name} - {e.date} {e.time} ({e.stage})</li>
          ))}
        </ul>
      </div>
    );
  }
}
ReactDOM.render(<App />, document.getElementById('root'));
