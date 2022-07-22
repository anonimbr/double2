import React, { useEffect, useState } from "react";
import "./styles.css";
import crypto from "crypto";

const TILES = [
  { number: 0, color: "white" },
  { number: 11, color: "black" },
  { number: 5, color: "red" },
  { number: 10, color: "black" },
  { number: 6, color: "red" },
  { number: 9, color: "black" },
  { number: 7, color: "red" },
  { number: 8, color: "black" },
  { number: 1, color: "red" },
  { number: 14, color: "black" },
  { number: 2, color: "red" },
  { number: 13, color: "black" },
  { number: 3, color: "red" },
  { number: 12, color: "black" },
  { number: 4, color: "red" }
];

export default function App(props) {
  const [state, setState] = useState({
    server_seed: "",
    amount: 10
  });

  useEffect(() => {
    if (location.search) {
      const qr = location.search;
      const param = new URLSearchParams(qr);
      const seed = param.get("seed");
      if (seed) {
        setState((pre) => ({ ...pre, server_seed: seed }));
      }
    }
  }, [location.search]);

  const chain = [state.server_seed];
  for (let i = 0; i < state.amount; i++) {
    chain.push(
      crypto
        .createHash("sha256")
        .update(chain[chain.length - 1])
        .digest("hex")
    );
  }
  const clientSeed =
    "00000000000000000007a22994852b2df174814c58b045bb713818ef644ab8a9";
  return (
    <div className="App">
      <h3>Enter the server seed of your game</h3>
      <input
        style={{ width: 470 }}
        value={state.server_seed}
        onChange={(e) => setState({ ...state, server_seed: e.target.value })}
      />
      <br />
      <br />
      <h3>Enter the # of games to view before this one</h3>
      <input
        value={state.amount}
        onChange={(e) => setState({ ...state, amount: e.target.value })}
      />

      <hr />
      <h1>Double rolls:</h1>

      {!state.server_seed || state.server_seed.length !== 64 ? (
        <h3 style={{ color: "red" }}>
          Please enter a server seed to view this table
        </h3>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Roll</th>
              <th>Seed</th>
            </tr>
          </thead>
          <tbody>
            {chain.map((seed, index) => {
              const hash = crypto
                .createHmac("sha256", seed)
                .update(clientSeed)
                .digest("hex");

              // roulette number from 0-15
              const n = parseInt(hash, 16) % 15;

              const tile = TILES.find((t) => t.number === n);

              return (
                <tr key={`row_${seed}`}>
                  <td style={{ color: tile.color }}>
                    {tile.color.slice(0, 1).toUpperCase() + tile.color.slice(1)}{" "}
                    {n}
                  </td>
                  <td>{seed}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
