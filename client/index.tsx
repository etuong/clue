import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const mountingPoint = document.createElement("div");
document.body.appendChild(mountingPoint);
ReactDOM.render(<App />, mountingPoint);
