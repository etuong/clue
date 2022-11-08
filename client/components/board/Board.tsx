import * as React from "react";
import { Room, Empty } from "./Room";
import { Hall } from "./Hall";
import BATHROOM from "../../assets/ballroom.png";
import BILLIARD from "../../assets/billiard.png";
import CONSERVATORY from "../../assets/conservatory.png";
import DINING from "../../assets/dining.png";
import HALL from "../../assets/hall.png";
import KITCHEN from "../../assets/kitchen.png";
import LIBRARY from "../../assets/library.png";
import LOUNGE from "../../assets/lounge.png";
import STUDY from "../../assets/study.png";
import "./Board.scss";
import { useState, useEffect } from "react";
import { ApiClient } from "../../ApiClient";
import { prettifyName } from "../../utils/CharacterNameHelper";
import { Suspect } from "../console/Suspect";

export const Board = (props) => {
  "use strict";
  const [study, setStudy] = useState<string>("");
  const [studyHall, setStudyHall] = useState<string>("");
  const [hall, setHall] = useState<string>("");
  const [hallLounge, setHallLounge] = useState<string>("");
  const [lounge, setLounge] = useState<string>("");
  const [studyLibrary, setStudyLibrary] = useState<string>("");
  const [hallBilliard, setHallBilliard] = useState<string>("");
  const [loungeDining, setLoungeDining] = useState<string>("");
  const [library, setLibrary] = useState<string>("");
  const [libraryBilliard, setLibraryBilliard] = useState<string>("");
  const [billiard, setBilliard] = useState<string>("");
  const [billiardDining, setBilliardDining] = useState<string>("");
  const [dining, setDining] = useState<string>("");
  const [libraryConservatory, setLibraryConservatory] = useState<string>("");
  const [billiardBallroom, setBilliardBallroom] = useState<string>("");
  const [diningKitchen, setDiningKitchen] = useState<string>("");
  const [conservatory, setConservatory] = useState<string>("");
  const [conservatoryBallroom, setConservatoryBallroom] = useState<string>("");
  const [ballroom, setBallroom] = useState<string>("");
  const [ballroomKitchen, setBallroomKitchen] = useState<string>("");
  const [kitchen, setKitchen] = useState<string>("");

  const [isStudySelected, setIsStudySelected] = useState<boolean>(false);
  const [isStudyHallSelected, setIsStudyHallSelected] =
    useState<boolean>(false);
  const [isHallSelected, setIsHallSelected] = useState<boolean>(false);
  const [isHallLoungeSelected, setIsHallLoungeSelected] =
    useState<boolean>(false);
  const [isLoungeSelected, setIsLoungeSelected] = useState<boolean>(false);
  const [isStudyLibrarySelected, setIsStudyLibrarySelected] =
    useState<boolean>(false);
  const [isHallBilliardSelected, setIsHallBilliardSelected] =
    useState<boolean>(false);
  const [isLoungeDiningSelected, setLoungeDiningSelected] =
    useState<boolean>(false);
  const [isLibarySelected, setIsLibarySelected] = useState<boolean>(false);
  const [isLibraryBilliardSelected, setIsLibraryBilliardSelected] =
    useState<boolean>(false);
  const [isBilliardSelected, setIsBilliardSelected] = useState<boolean>(false);
  const [isBilliardDiningSelected, setIsBilliardDiningSelected] =
    useState<boolean>(false);
  const [isDiningSelected, setIsDiningSelected] = useState<boolean>(false);
  const [isLibraryConservatorySelected, setIsLibraryConservatorySelected] =
    useState<boolean>(false);
  const [isBilliardBallroomSelected, setIsBilliardBallroomSelected] =
    useState<boolean>(false);
  const [isDiningKitchenSelected, setIsDiningKitchenSelected] =
    useState<boolean>(false);
  const [isConservatorySelected, setIsConservatorySelected] =
    useState<boolean>(false);
  const [isConservatoryBallroomSelected, setIsConservatoryBallroomSelected] =
    useState<boolean>(false);
  const [isBallroomSelected, setIsBallroomSelected] = useState<boolean>(false);
  const [isBallroomKitchenSelected, setIsBallroomKitchenSelected] =
    useState<boolean>(false);
  const [isKitchenSelected, setIsKitchenSelected] = useState<boolean>(false);

  useEffect(() => {
    if (props.character !== "") {
      props.socket.on("update-board", async function (currentCharacter) {
        await resetBoard();
        const response = await ApiClient.get("/players");

        for (var key of Object.keys(response)) {
          const player = response[key];
          const roomHall = player.room_hall;
          const characterName = player.character_name;
          const prettifiedCharacterName = prettifyName(characterName);

          setRoomOrHall(roomHall, prettifiedCharacterName);

          if (
            props.character === currentCharacter &&
            characterName === currentCharacter &&
            !player.allow_disapproval
          ) {
            const availableMoves = player.available_moves;
            for (var counter in availableMoves) {
              setRoomOrHallIsSelected(availableMoves[counter]);
            }
          }
        }
      });
    }
  }, [props.character]);

  const publishNewLocation = async (tag) => {
    const payload = { location: tag };
    const response = await ApiClient.put(
      "/player/move/" + props.player,
      payload
    );
    if (response.error === undefined) {
      props.socket.emit(
        "channel-player-move-only",
        props.player + " (" + Suspect[props.character] + ") has moved to " + tag
      );
      props.socket.emit(
        "channel-current-player",
        response.current_player_info.player_name,
        response.current_player_info.character_name,
        Suspect[response.current_player_info.character_name]
      );
    }
  };

  const isEmpty = (str: string) => !str || 0 === str.length;
  const cleanRoom = (room: string, character: string) =>
    isEmpty(room)
      ? character
      : room.includes(character)
      ? room
      : room + ", " + character;

  const setRoomOrHall = (roomHall, prettifiedCharacterName) => {
    switch (roomHall) {
      case "study":
        setStudy((prev) => cleanRoom(prev, prettifiedCharacterName));
        break;
      case "study-hall":
        setStudyHall((prev) => cleanRoom(prev, prettifiedCharacterName));
        break;
      case "hall":
        setHall((prev) => cleanRoom(prev, prettifiedCharacterName));
        break;
      case "hall-lounge":
        setHallLounge((prev) => cleanRoom(prev, prettifiedCharacterName));
        break;
      case "lounge":
        setLounge((prev) => cleanRoom(prev, prettifiedCharacterName));
        break;
      case "study-library":
        setStudyLibrary((prev) => cleanRoom(prev, prettifiedCharacterName));
        break;
      case "hall-billiard":
        setHallBilliard((prev) => cleanRoom(prev, prettifiedCharacterName));
        break;
      case "lounge-dining":
        setLoungeDining((prev) => cleanRoom(prev, prettifiedCharacterName));
        break;
      case "library":
        setLibrary((prev) => cleanRoom(prev, prettifiedCharacterName));
        break;
      case "library-billiard":
        setLibraryBilliard((prev) => cleanRoom(prev, prettifiedCharacterName));
        break;
      case "billiard":
        setBilliard((prev) => cleanRoom(prev, prettifiedCharacterName));
        break;
      case "billiard-dining":
        setBilliardDining((prev) => cleanRoom(prev, prettifiedCharacterName));
        break;
      case "dining":
        setDining((prev) => cleanRoom(prev, prettifiedCharacterName));
        break;
      case "library-conservatory":
        setLibraryConservatory((prev) =>
          cleanRoom(prev, prettifiedCharacterName)
        );
        break;
      case "billiard-ballroom":
        setBilliardBallroom((prev) => cleanRoom(prev, prettifiedCharacterName));
        break;
      case "dining-kitchen":
        setDiningKitchen((prev) => cleanRoom(prev, prettifiedCharacterName));
        break;
      case "conservatory":
        setConservatory((prev) => cleanRoom(prev, prettifiedCharacterName));
        break;
      case "conservatory-ballroom":
        setConservatoryBallroom((prev) =>
          cleanRoom(prev, prettifiedCharacterName)
        );
        break;
      case "ballroom":
        setBallroom((prev) => cleanRoom(prev, prettifiedCharacterName));
        break;
      case "ballroom-kitchen":
        setBallroomKitchen((prev) => cleanRoom(prev, prettifiedCharacterName));
        break;
      case "kitchen":
        setKitchen((prev) => cleanRoom(prev, prettifiedCharacterName));
        break;
    }
  };

  const setRoomOrHallIsSelected = (roomOrHall) => {
    switch (roomOrHall) {
      case "study":
        setIsStudySelected(true);
        break;
      case "study-hall":
        setIsStudyHallSelected(true);
        break;
      case "hall":
        setIsHallSelected(true);
        break;
      case "hall-lounge":
        setIsHallLoungeSelected(true);
        break;
      case "lounge":
        setIsLoungeSelected(true);
        break;
      case "study-library":
        setIsStudyLibrarySelected(true);
        break;
      case "hall-billiard":
        setIsHallBilliardSelected(true);
        break;
      case "lounge-dining":
        setLoungeDiningSelected(true);
        break;
      case "library":
        setIsLibarySelected(true);
        break;
      case "library-billiard":
        setIsLibraryBilliardSelected(true);
        break;
      case "billiard":
        setIsBilliardSelected(true);
        break;
      case "billiard-dining":
        setIsBilliardDiningSelected(true);
        break;
      case "dining":
        setIsDiningSelected(true);
        break;
      case "library-conservatory":
        setIsLibraryConservatorySelected(true);
        break;
      case "billiard-ballroom":
        setIsBilliardBallroomSelected(true);
        break;
      case "dining-kitchen":
        setIsDiningKitchenSelected(true);
        break;
      case "conservatory":
        setIsConservatorySelected(true);
        break;
      case "conservatory-ballroom":
        setIsConservatoryBallroomSelected(true);
        break;
      case "ballroom":
        setIsBallroomSelected(true);
        break;
      case "ballroom-kitchen":
        setIsBallroomKitchenSelected(true);
        break;
      case "kitchen":
        setIsKitchenSelected(true);
        break;
    }
  };

  const resetBoard = async () => {
    const EMPTY = "";
    setStudy(EMPTY);
    setStudyHall(EMPTY);
    setHall(EMPTY);
    setHallLounge(EMPTY);
    setLounge(EMPTY);
    setStudyLibrary(EMPTY);
    setHallBilliard(EMPTY);
    setLoungeDining(EMPTY);
    setLibrary(EMPTY);
    setLibraryBilliard(EMPTY);
    setBilliard(EMPTY);
    setBilliardDining(EMPTY);
    setDining(EMPTY);
    setLibraryConservatory(EMPTY);
    setBilliardBallroom(EMPTY);
    setDiningKitchen(EMPTY);
    setConservatory(EMPTY);
    setConservatoryBallroom(EMPTY);
    setBallroom(EMPTY);
    setBallroomKitchen(EMPTY);
    setKitchen(EMPTY);

    setIsStudySelected(false);
    setIsStudyHallSelected(false);
    setIsHallSelected(false);
    setIsHallLoungeSelected(false);
    setIsLoungeSelected(false);
    setIsStudyLibrarySelected(false);
    setIsHallBilliardSelected(false);
    setLoungeDiningSelected(false);
    setIsLibarySelected(false);
    setIsLibraryBilliardSelected(false);
    setIsBilliardSelected(false);
    setIsBilliardDiningSelected(false);
    setIsDiningSelected(false);
    setIsLibraryConservatorySelected(false);
    setIsBilliardBallroomSelected(false);
    setIsDiningKitchenSelected(false);
    setIsConservatorySelected(false);
    setIsConservatoryBallroomSelected(false);
    setIsBallroomSelected(false);
    setIsBallroomKitchenSelected(false);
    setIsKitchenSelected(false);
  };

  return (
    <table>
      <tbody>
        <tr>
          <Room
            room={STUDY}
            character={study}
            selected={isStudySelected}
            tag="study"
            cellClick={publishNewLocation}
          />
          <Hall
            horizontal={true}
            character={studyHall}
            selected={isStudyHallSelected}
            tag="study-hall"
            cellClick={publishNewLocation}
          />
          <Room
            room={HALL}
            character={hall}
            selected={isHallSelected}
            tag="hall"
            cellClick={publishNewLocation}
          />
          <Hall
            horizontal={true}
            character={hallLounge}
            selected={isHallLoungeSelected}
            tag="hall-lounge"
            cellClick={publishNewLocation}
          />
          <Room
            room={LOUNGE}
            character={lounge}
            selected={isLoungeSelected}
            tag="lounge"
            cellClick={publishNewLocation}
          />
        </tr>
        <tr>
          <Hall
            horizontal={false}
            character={studyLibrary}
            selected={isStudyLibrarySelected}
            tag="study-library"
            cellClick={publishNewLocation}
          />
          <Empty />
          <Hall
            horizontal={false}
            character={hallBilliard}
            selected={isHallBilliardSelected}
            tag="hall-billiard"
            cellClick={publishNewLocation}
          />
          <Empty />
          <Hall
            horizontal={false}
            character={loungeDining}
            selected={isLoungeDiningSelected}
            tag="lounge-dining"
            cellClick={publishNewLocation}
          />
        </tr>
        <tr>
          <Room
            room={LIBRARY}
            character={library}
            selected={isLibarySelected}
            tag="library"
            cellClick={publishNewLocation}
          />
          <Hall
            horizontal={true}
            character={libraryBilliard}
            selected={isLibraryBilliardSelected}
            tag="library-billiard"
            cellClick={publishNewLocation}
          />
          <Room
            room={BILLIARD}
            character={billiard}
            selected={isBilliardSelected}
            tag="billiard"
            cellClick={publishNewLocation}
          />
          <Hall
            horizontal={true}
            character={billiardDining}
            selected={isBilliardDiningSelected}
            tag="billiard-dining"
            cellClick={publishNewLocation}
          />
          <Room
            room={DINING}
            character={dining}
            selected={isDiningSelected}
            tag="dining"
            cellClick={publishNewLocation}
          />
        </tr>
        <tr>
          <Hall
            horizontal={false}
            character={libraryConservatory}
            selected={isLibraryConservatorySelected}
            tag="library-conservatory"
            cellClick={publishNewLocation}
          />
          <Empty />
          <Hall
            horizontal={false}
            character={billiardBallroom}
            selected={isBilliardBallroomSelected}
            tag="billiard-ballroom"
            cellClick={publishNewLocation}
          />
          <Empty />
          <Hall
            horizontal={false}
            character={diningKitchen}
            selected={isDiningKitchenSelected}
            tag="dining-kitchen"
            cellClick={publishNewLocation}
          />
        </tr>
        <tr>
          <Room
            room={CONSERVATORY}
            character={conservatory}
            selected={isConservatorySelected}
            tag="conservatory"
            cellClick={publishNewLocation}
          />
          <Hall
            horizontal={true}
            character={conservatoryBallroom}
            selected={isConservatoryBallroomSelected}
            tag="conservatory-ballroom"
            cellClick={publishNewLocation}
          />
          <Room
            room={BATHROOM}
            character={ballroom}
            selected={isBallroomSelected}
            tag="ballroom"
            cellClick={publishNewLocation}
          />
          <Hall
            horizontal={true}
            character={ballroomKitchen}
            selected={isBallroomKitchenSelected}
            tag="ballroom-kitchen"
            cellClick={publishNewLocation}
          />
          <Room
            room={KITCHEN}
            character={kitchen}
            selected={isKitchenSelected}
            tag="kitchen"
            cellClick={publishNewLocation}
          />
        </tr>
      </tbody>
    </table>
  );
};
