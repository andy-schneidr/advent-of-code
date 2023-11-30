import React, { useState } from 'react';
import './App.css';
import logo from './logo.svg';
import useDayExample from './components/useDayExample/useDayExample';
import Day from './components/Day/Day';

function App() {

  const options = [
    {value: "Example", day: useDayExample},
  ]

  const [day, setDay] = useState("Example");

  const selectedDay = options.find((option) => option.value === day)?.day;

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          <img src={logo} className="App-logo" alt="logo" />
          <span>Advent of Code 2023</span>
          <img src={logo} className="App-logo" alt="logo" />
        </h1>
        <div className="Day-select">
          <p>Select a day</p>
          <select value={day} onChange={(e) => setDay(e.currentTarget.value)}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value}
              </option>
            ))}
          </select>
        </div>
      </header>


      { selectedDay ? <Day useDay={selectedDay} /> : <div>Select a day</div> }
    </div>
  );
}

export default App;
