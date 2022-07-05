import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";
import Spinner from "../components/Spinner";

const MiniInfo = () => {
  const [miniInfo, setMiniInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();

  const fetchMiniInfo = async () => {
    const docRef = doc(db, "minis", params.miniId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      //console.log(docSnap.data());
      setMiniInfo(docSnap.data());
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMiniInfo();
  }, [params.miniId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="miniInfo-page-container">
        <div className="miniInfo-grid">
          <div className="miniInfo-grid-title">
            <h1>{miniInfo.name}</h1>
          </div>
          <div className="miniInfo-grid-item">
            <div className="miniInfo-details">
              <p>
                <b>Rarity:</b> {miniInfo.rarity}
              </p>
              <p>
                <b>Gender:</b> {miniInfo.gender}
              </p>
              <p>
                <b>Race:</b> {miniInfo.race}
              </p>
              <p>
                <b>Race:</b> {miniInfo.type}
              </p>
              <p>
                <b>Size:</b> {miniInfo.size}
              </p>
              <p>
                <b>Set Number:</b> {miniInfo.number}
              </p>
              <p>
                <b>Quantity:</b> {miniInfo.quantity}
              </p>
              <p>
                <b>Maker:</b> {miniInfo.maker}
              </p>
              <p>
                <b>Brand:</b> {miniInfo.brand}
              </p>
              <p>
                <b>Set:</b> {miniInfo.set}
              </p>
              <p>
                <b>Statblock:</b>
                {"  "}
                <a href={miniInfo.statblock} target="_blank">
                  here
                </a>
              </p>
            </div>
          </div>

          <div className="miniInfo-grid-item">
            <div className="miniInfo-img">
              <img src={miniInfo.imageUrls[0]} alt="" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MiniInfo;
