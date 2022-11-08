import React from "react";
import "./Cards.scss";
import { useState, useEffect } from "react";

export const Cards = (props) => {
  const [disapprove, setDisapprove] = useState<boolean>(false);

  useEffect(() => {
    if (props.player !== "") {
      props.socket.on("disapprove", function (msg, a) {
        setDisapprove(
          a.player_name === props.player ? a.allow_disapproval : false
        );
      });
    }
  }, [props.player]);

  return (
    <div className="card-container">
      <p className="title">{props.player && `${props.player}'s`} Cards</p>

      {props.set.map((card, idx) => {
        return (
          <img
            key={idx}
            src={card}
            className={`${disapprove && "disapprove"}`}
            onClick={
              disapprove ? () => props.cardClick(card, props.player) : undefined
            }
          />
        );
      })}
    </div>
  );
};
