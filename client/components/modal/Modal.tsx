import React, { useState, useEffect } from "react";
import "./Modal.scss";
import { Suspect } from "../console/Suspect";
import { ApiClient } from "../../ApiClient";

export const Modal = (props) => {
  const [player, setPlayer] = useState<string>("");
  const [character, setCharacter] = useState<string>(Suspect.miss_scarlet);
  const [dialog, setDialog] = useState<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (dialog && dialog.showModal) {
      dialog!.showModal();
    }
  }, [dialog]);

  const handleplayerChange = (event) => {
    setPlayer(event.target.value);
  };

  const handlecharacterChange = (selectedOption) => {
    setCharacter(selectedOption.target.value);
  };

  const handlePlayButton = () => {
    const character_name =
      character === "Miss Scarlet" ? "miss_scarlet" : character;
    const payload = { character_name: character_name };
    ApiClient.put("/player/" + player, payload);
    props.handleCallback(player, character_name);
    dialog!.close();
  };

  return (
    <dialog
      ref={(ref) => setDialog(ref)}
      className={`modal center-dialog modal-body`}
    >
      <p>To play, please type in your name and choose a character</p>
      <div className="block">
        <label>Name:</label>
        <input type="text" value={player} onChange={handleplayerChange} />
      </div>
      <div className="block">
        <label>Character:</label>
        <select onChange={handlecharacterChange}>
          {Object.keys(Suspect).map((key) => (
            <option key={key} value={key}>
              {Suspect[key as any]}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handlePlayButton}>Play!</button>
    </dialog>
  );
};
