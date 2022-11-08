import { Suspect } from "../components/console/Suspect";

export const prettifyName = (name) => {
  return Suspect[name];
};

export const unprettifyName = (name) => {
  let unprettifiedName = "";
  switch (name) {
    case "Miss Scarlet":
      unprettifiedName = "miss_scarlet";
      break;
    case "Professor Plum":
      unprettifiedName = "professor_plum";
      break;
    case "Colonel Mustard":
      unprettifiedName = "colonel_mustard";
      break;
    case "Mrs. Peacock":
      unprettifiedName = "mrs_peacock";
      break;
    case "Mr. Green":
      unprettifiedName = "mr_green";
      break;
    case "Mrs. White":
      unprettifiedName = "mrs_white";
      break;
    default:
      break;
  }
  return unprettifiedName;
};
