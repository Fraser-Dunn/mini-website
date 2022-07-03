import React from "react";
import { Link } from "react-router-dom";

const SetCard = (props) => {
  //console.log(props.mini);
  return (
    <>
      <div className="setCard-main-div shadow-lg">
        <div className="setCard-title">
          <h1>{props.miniSet}</h1>
        </div>
        <div className="setCard-img-div">
          <img className="setCard-img" src={props.firstOfSetImg} alt="/" />
        </div>
        <div className="setCard-footer">
          <button className="setCard-footer-button">
            <h1>View Set</h1>
          </button>
        </div>
      </div>
    </>
  );
};

export default SetCard;
