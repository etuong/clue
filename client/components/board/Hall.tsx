import * as React from "react";

export const Hall = (props) => {
  return (
    <td onClick={props.selected ? () => props.cellClick(props.tag) : undefined}>
      <div
        className={`${props.horizontal ? "horizontal-hall" : "vertical-hall"}
        ${props.selected ? "path" : ""}`}
      >
        <div
          className={
            props.character
              ? props.horizontal
                ? "player in-horz-hall"
                : "player in-vert-hall"
              : ""
          }
        >
          {props.character}
        </div>
      </div>
    </td>
  );
};
