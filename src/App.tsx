import React from "react";
import { useAppState } from "./reducer";
import "./App.css";

export default function App() {
  const [state, dispatch] = useAppState();
  let boardClasses = "board";
  let message;

  if (!state.user) {
    message = `Who will you play as?`;
  } else if (state.winning_player) {
    boardClasses = "board game-over";
    message = `The Champion is ${state.winning_player}`;
  } else if (!state.spaces.includes(null) && state.winning_player === null) {
    boardClasses = "board game-over";
    message = "This game is for the cats";
  } else {
    message = `Current Player: ${state.turn}`;
  }

  const catsGame =
    state.spaces.every((cell) => cell !== null) && !state.winning_player;

  return (
    <div className="App">
      <div className={boardClasses}>
        {state.spaces.map((value, index) => {
          const isWinningSquare = state.winning_squares?.includes(index);
          const canUserPlayHere =
            state.user === null ||
            (state.user === state.turn && value === null);
          return (
            <button
              className={isWinningSquare ? "square winner-declared" : "square"}
              disabled={!canUserPlayHere}
              key={index}
              onClick={() => {
                if (state.user) dispatch.user_play(index);
                else {
                  dispatch.choose_user("X");
                  dispatch.user_play(index);
                }
              }}
            >
              {catsGame ? (value === "X" ? "😾" : "🙀") : value}
            </button>
          );
        })}
      </div>
      <div className="game-play">
        <div className="turns">{message}</div>
        {state.user ? (
          <button className="reset" onClick={() => dispatch.reset()}>
            Reset game
          </button>
        ) : (
          <div>
            <button
              className="player-select"
              onClick={() => dispatch.choose_user("X")}
            >
              X
            </button>
            <button
              className="player-select"
              onClick={() => dispatch.choose_user("O")}
            >
              O
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
