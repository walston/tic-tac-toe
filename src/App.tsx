import React from "react";
import { useAppState } from "./reducer";
import "./App.css";

export default function App() {
  const [state, dispatch] = useAppState();
  let boardClasses = "board";
  let message;

  if (state.winning_player) {
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
      {state.user === null ? (
        <p>
          Who will you play?
          <button onClick={() => dispatch.choose_user("X")}>X</button>
          <button onClick={() => dispatch.choose_user("O")}>O</button>
        </p>
      ) : null}
      <div className={boardClasses}>
        {state.spaces.map((value, index) => {
          const isWinningSquare = state.winning_squares?.includes(index);
          const canUserPlayHere = state.user === state.turn && value === null;
          return (
            <button
              className={isWinningSquare ? "square winner-declared" : "square"}
              disabled={!(state.user && canUserPlayHere)}
              key={index}
              onClick={() => dispatch.user_play(index)}
            >
              {catsGame ? (value === "X" ? "😾" : "🙀") : value}
            </button>
          );
        })}
      </div>
      <div className="game-play">
        <div className="turns">{message}</div>
        <button className="reset" onClick={() => dispatch.reset()}>
          Reset game
        </button>
      </div>
    </div>
  );
}
