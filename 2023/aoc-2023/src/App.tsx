import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import "./App.css";
import logo from "./logo.svg";
import Day from "./components/Day/Day";
import useDay1 from "./components/useDay1/useDay1";
import useDay2 from "./components/useDay2/useDay2";
import useDay3 from "./components/useDay3/useDay3";
import useDay4 from "./components/useDay4/useDay4";
import useDay5 from "./components/useDay5/useDay5";
const options = [
  { value: "1", day: useDay1 },
  { value: "2", day: useDay2 },
  { value: "3", day: useDay3 },
  { value: "4", day: useDay4 },
  { value: "5", day: useDay5 },
];

const Dropdown = () => {
  const url = new URL(window.location.href);
  const args = new URLSearchParams(url.search);
  const navigate = useNavigate();

  const location = useLocation();

  const dayParam = URLSearchParams ? args.get("day") : null;

  const [day, setDay] = useState<string | undefined>(dayParam || "1");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("day", day || "1");
    navigate({
      pathname: "/",
      search: searchParams.toString(),
    });
  }, [day, location.search, navigate]);

  return (
    <div className="Day-select">
      <p>Select a day</p>
      <select
        value={day}
        placeholder="Select a day"
        onChange={(e) => setDay(e.currentTarget.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.value}
          </option>
        ))}
      </select>
    </div>
  );
};

function App() {
  const location = useLocation();

  const args = new URLSearchParams(location.search);
  const dayParam = URLSearchParams ? args.get("day") : null;
  const useDayFound = options.find((option) => option.value === dayParam);
  const useDay = useDayFound ? useDayFound.day : undefined;

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          <img src={logo} className="App-logo" alt="logo" />
          <span>AoC 2023 in TypeScript</span>
          <img src={logo} className="App-logo" alt="logo" />
        </h1>
      </header>
      <Dropdown />

      <Routes>
        <Route
          key={Date.UTC.toString()}
          path="/"
          element={useDay ? <Day useDay={useDay} /> : null}
        />
      </Routes>
    </div>
  );
}

export default App;