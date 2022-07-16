import React from "react";
import ReactDOM from "react-dom";
import Note from "../components/note/Notes.tsx";

describe("Note", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Note />, div);
  });
});
