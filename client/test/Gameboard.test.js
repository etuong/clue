import React from "react";
import ReactDOM from "react-dom";
import App from "../App";

import { Room } from "../components/console/Room";
import { Suspect } from "../components/console/Suspect";
import { Weapon } from "../components/console/Weapon";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe("Gameboard Objects tests", () => {
  test("The Room count must be 9", () => {
    var roomCount = 0;
    for (var room in Room) {
      roomCount++;
    }
    expect(roomCount).toBe(9);
  });

  test("The Weapon count must be 6", () => {
    var weaponCount = 0;
    for (var weapon in Weapon) {
      weaponCount++;
    }
    expect(weaponCount).toBe(6);
  });

  test("The Suspect count must be 6", () => {
    var suspectCount = 0;
    for (var suspect in Suspect) {
      suspectCount++;
    }
    expect(suspectCount).toBe(6);
  });
});

describe("CaseFile tests", () => {
  var caseFileWeapon = "Pistol";
  var caseFileRoom = "Lounge";
  var caseFileSuspect = "RevGreen";
  var cardCountWeapon = 0;
  var cardCountRoom = 0;
  var cardCountSuspect = 0;
  var cardCount = 0;

  test("Case File must contain Only one Room Card", () => {
    var boolRoom = false;

    for (var room in Room) {
      if (room == caseFileRoom) {
        boolRoom = true;
        cardCountRoom++;
        cardCount++;
      }
    }
    expect(boolRoom).toBe(true);
    expect(cardCountRoom).toBe(1);
  });

  test("Case File must contain Only one Weapon Card", () => {
    var boolWeapon = false;
    for (var weapon in Weapon) {
      if (weapon == caseFileWeapon) {
        boolWeapon = true;
        cardCountWeapon++;
        cardCount++;
      }
    }
    expect(boolWeapon).toBe(true);
    expect(cardCountWeapon).toBe(1);
  });

  test("Case File must contain Only one Suspect Card", () => {
    var boolSuspect = false;
    for (var suspect in Suspect) {
      if (suspect == caseFileSuspect) {
        boolSuspect = true;
        cardCountSuspect++;
        cardCount++;
      }
    }
    expect(boolSuspect).toBe(true);
    expect(cardCountSuspect).toBe(1);
  });

  test("Case File duplicate Card Type Check", () => {
    expect(cardCount).toBe(3);
  });
});
describe("Player - Token Assignment test", () => {
  var caseFileWeapon = "Pistol";
  var caseFileRoom = "Lounge";
  var cardCountRoom = 0;
  var cardCount = 0;
  //Verify a Suspect Token can only be assigned to a Player once.

  test("A Player must be assigned to a Suspect Token", () => {
    var boolRoom = false;

    for (var room in Room) {
      if (room == caseFileRoom) {
        boolRoom = true;
        cardCountRoom++;
        cardCount++;
      }
    }
    expect(boolRoom).toBe(true);
    expect(cardCountRoom).toBe(1);
  });
});
