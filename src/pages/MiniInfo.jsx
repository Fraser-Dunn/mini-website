import { useState } from "react";
import { useParams } from "react-router-dom";

import Spinner from "../components/Spinner";

const MiniInfo = ({ data, loading }) => {
  const params = useParams();

  let currentMini = [];
  data.forEach((mini) => {
    if (mini.id === params.miniId) {
      return (currentMini = mini);
    }
  });

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="miniInfo-page-container">
        <div className="miniInfo-grid">
          <div className="miniInfo-grid-title">
            <h1>{currentMini.name}</h1>
          </div>
          <div className="miniInfo-grid-item">
            <div className="miniInfo-details">
              <p>
                <b>Rarity:</b> {currentMini.rarity}
              </p>
              <p>
                <b>Gender:</b> {currentMini.gender}
              </p>
              <p>
                <b>Race:</b> {currentMini.race}
              </p>
              <p>
                <b>Type:</b> {currentMini.type}
              </p>
              <p>
                <b>Size:</b> {currentMini.size}
              </p>
              <p>
                <b>Set Number:</b> {currentMini.number}
              </p>
              <p>
                <b>Quantity:</b> {currentMini.quantity}
              </p>
              <p>
                <b>Maker:</b> {currentMini.maker}
              </p>
              <p>
                <b>Brand:</b> {currentMini.brand}
              </p>
              <p>
                <b>Set:</b> {currentMini.set}
              </p>
              <p>
                <b>Statblock:</b>
                {"  "}
                <a
                  href={currentMini.statblock}
                  target="_blank"
                  rel="noreferrer"
                >
                  here
                </a>
              </p>
            </div>
          </div>

          <div className="miniInfo-grid-item">
            <div className="miniInfo-img">
              <img src={currentMini.imageUrls[0]} alt="" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MiniInfo;
