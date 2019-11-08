import React, { useState, useEffect } from "react";
import "./Modal.scss";
import { Suspect } from "../console/Suspect";
import { ApiClient } from "../../ApiClient";

export const Modal = props => {
  const [username, setUsername] = useState<string>("");
  const [numberOfPlayers, setNumberOfPlayers] = useState<number>();
  const [player, setPlayer] = useState<string>("");
  const [dialog, setDialog] = useState<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (dialog && dialog.showModal) {
      dialog!.showModal();
    }
  }, [dialog]);

  const handleUsernameChange = event => {
    setUsername(event.target.value);
  };

  const handleNumberOfPlayerChange = event => {
    setNumberOfPlayers(event.target.value);
  };

  const handlePlayerChange = selectedOption => {
    setPlayer(Suspect[selectedOption.target.value]);
  };

  const handleButton = () => {
    const json = { "character_name": player };
    ApiClient.post("/player/" + username, json);
    dialog!.close();
  };

  return (
    <dialog
      ref={ref => setDialog(ref)}
      className={`modal center-dialog modal-body`}
    >
      <p>To play, please type in your name and choose a player</p>
      <div className="block">
        <label>Name:</label>
        <input type="text" value={username} onChange={handleUsernameChange} />
      </div>
      <div className="block">
        <label>Number of Players:</label>
        <input type="text" value={numberOfPlayers} onChange={handleNumberOfPlayerChange} />
      </div>
      <div className="block">
        <label>Character:</label>
        <select onChange={handlePlayerChange}>
          {Object.keys(Suspect).map(key => (
            <option key={key} value={key}>
              {Suspect[key as any]}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleButton}>Play!</button>
    </dialog>
  );
};
