import { useState, useEffect } from "react";
import { MidnightButton } from "./useMidnight";
import DisplayMessage from "./components/DisplayMessage";
import BoardCell from "./components/BoardCell";

type Placement = { cells: number[]; orientation: "horizontal" | "vertical" };

const model = {
  boardSize: 7,
  numShips: 3,
  shipsSunk: 0
};

/* 

THE CODE IN THIS APP HAS BEEN ADAPTED FROM https://codepen.io/patrycja-b/pen/EWRywX

*/

function App() {
  let [displayMsg, setDisplayMsg] = useState(
    "Hello, let's play! There are 3 ships, each 3 cells long"
  );
  let [ships, setShips] = useState([
    { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] }
  ]);
  let [hits, setHits] = useState<Array<number>>([]);
  let [miss, setMiss] = useState<Array<number>>([]);

  const generateGroups = (
    gridSize: number,
    groupSize: number,
    numGroups: number
  ): Placement[] => {
    const grid: Set<number> = new Set();
    const placements: Placement[] = [];

    const isCellAvailable = (cells: number[]): boolean =>
      cells.every(cell => !grid.has(cell));

    const addGroupToGrid = (cells: number[]): void =>
      cells.forEach(cell => grid.add(cell));

    while (placements.length < numGroups) {
      const orientation = Math.random() < 0.5 ? "horizontal" : "vertical";
      const startRow = Math.floor(Math.random() * gridSize);
      const startCol = Math.floor(Math.random() * gridSize);

      if (orientation === "horizontal" && startCol <= gridSize - groupSize) {
        const cells = Array.from(
          { length: groupSize },
          (_, i) => startRow * gridSize + startCol + i
        );
        if (isCellAvailable(cells)) {
          placements.push({ cells, orientation });
          addGroupToGrid(cells);
        }
      } else if (
        orientation === "vertical" &&
        startRow <= gridSize - groupSize
      ) {
        const cells = Array.from(
          { length: groupSize },
          (_, i) => (startRow + i) * gridSize + startCol
        );
        if (isCellAvailable(cells)) {
          placements.push({ cells, orientation });
          addGroupToGrid(cells);
        }
      }
    }

    return placements;
  };

  const generateShipLocations = (): undefined => {
    const groups = generateGroups(7, 3, 3);
    for (let i = 0; i < model.numShips; i++) {
      ships[i].locations = groups[i].cells;
      setShips(ships);
    }

    console.log(ships);
  };

  const generateCells = (from: number, to: number): Array<JSX.Element> => {
    let cells = [];
    for (from; from <= to; from++) {
      cells.push(
        <BoardCell
          key={"cell-" + from.toString()}
          id={from}
          hit={hits.includes(from)}
          miss={miss.includes(from)}
          fire={fire}
        />
      );
    }
    return cells;
  };

  const fire = (cellId: number) => {
    // console.log({ cellId, ships, hits });
    // looks for the cell id in the ships array
    for (let i = 0; i < ships.length; i++) {
      if (ships[i].locations.includes(cellId) && !hits.includes(cellId)) {
        setHits([cellId, ...hits]);
        return;
      }
    }

    if (!miss.includes(cellId)) {
      setMiss([cellId, ...miss]);
    }
  };

  useEffect(() => {
    generateShipLocations();
  }, []);

  return (
    <>
      <div id="board">
        <DisplayMessage msg={displayMsg} />
        <table>
          <thead>
            <tr>
              <th className="numbers"></th>
              <th className="numbers">1</th>
              <th className="numbers">2</th>
              <th className="numbers">3</th>
              <th className="numbers">4</th>
              <th className="numbers">5</th>
              <th className="numbers">6</th>
              <th className="numbers">7</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className="letters">A</th>
              {generateCells(1, 7)}
            </tr>
            <tr>
              <th className="letters">B</th>
              {generateCells(8, 14)}
            </tr>
            <tr>
              <th className="letters">C</th>
              {generateCells(15, 21)}
            </tr>
            <tr>
              <th className="letters">D</th>
              {generateCells(22, 28)}
            </tr>
            <tr>
              <th className="letters">E</th>
              {generateCells(29, 35)}
            </tr>
            <tr>
              <th className="letters">F</th>
              {generateCells(36, 42)}
            </tr>
            <tr>
              <th className="letters">G</th>
              {generateCells(43, 49)}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="midnight-button">
        <MidnightButton />
      </div>
    </>
  );
}

export default App;
