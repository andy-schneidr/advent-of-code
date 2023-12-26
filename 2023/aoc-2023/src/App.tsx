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
import useDay6 from "./components/useDay6/useDay6";
import useDay7 from "./components/useDay7/useDay7";
import useDay8 from "./components/useDay8/useDay8";
import useDay9 from "./components/useDay9/useDay9";
import useDay10 from "./components/useDay10/useDay10";
import useDay11 from "./components/useDay11/useDay11";
import useDay12 from "./components/useDay12/useDay12";
import useDay13 from "./components/useDay13/useDay13";
import useDay14 from "./components/useDay14/useDay14";
import useDay15 from "./components/useDay15/useDay15";
import useDay16 from "./components/useDay16/useDay16";
import useDay17 from "./components/useDay17/useDay17";
import useDay18 from "./components/useDay18/useDay18";
import useDay19 from "./components/useDay19/useDay19";
import useDay20 from "./components/useDay20/useDay20";
import useDay21 from "./components/useDay21/useDay21";
import useDay22 from "./components/useDay22/useDay22";
import useDay23 from "./components/useDay23/useDay23";
import useDay24 from "./components/useDay24/useDay24";
const options = [
  { value: "1", day: useDay1 },
  { value: "2", day: useDay2 },
  { value: "3", day: useDay3 },
  { value: "4", day: useDay4 },
  { value: "5", day: useDay5 },
  { value: "6", day: useDay6 },
  { value: "7", day: useDay7 },
  { value: "8", day: useDay8 },
  { value: "9", day: useDay9 },
  { value: "10", day: useDay10 },
  { value: "11", day: useDay11 },
  { value: "12", day: useDay12 },
  { value: "13", day: useDay13 },
  { value: "14", day: useDay14 },
  { value: "15", day: useDay15 },
  { value: "16", day: useDay16 },
  { value: "17", day: useDay17 },
  { value: "18", day: useDay18 },
  { value: "19", day: useDay19 },
  { value: "20", day: useDay20 },
  { value: "21", day: useDay21 },
  { value: "22", day: useDay22 },
  { value: "23", day: useDay23 },
  { value: "24", day: useDay24 },
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
