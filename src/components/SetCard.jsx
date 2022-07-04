import React from "react";
import { Link } from "react-router-dom";

const SetCard = (props) => {
  console.log(props.miniSet);
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
          <Link to={`/sets/${props.miniSet}`}>
            <button className="setCard-footer-button">View Set</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default SetCard;
