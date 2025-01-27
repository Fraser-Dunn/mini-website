import React from "react";
import { Link } from "react-router-dom";

const SetCard = ({ firstOfSetImg, miniSet }) => {
  return (
    <>
      <div className="setCard-main-div">
        <div className="setCard-title">
          <h1>{miniSet}</h1>
        </div>
        <div className="setCard-img-div">
        <Link to={`/gallery?setFilter=${miniSet}`}>
          <img className="setCard-img" src={firstOfSetImg} alt="/" />
          </Link> 
        </div>
        <div className="setCard-footer">
          <Link to={`/gallery?setFilter=${miniSet}`}>
            <button className="setCard-footer-button">
              <h1>View Set</h1>
            </button>
          </Link> 
        </div>
      </div>
    </>
  );
};

export default SetCard;
