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
    //console.log(params.miniId);
    const docRef = doc(db, "minis", params.miniId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(docSnap.data());
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

  console.log(miniInfo.statblock);

  return (
    <>
      <div className="miniInfo-page-container">
        <div className="miniInfo-grid shadow-lg">
          <div className="miniInfo-grid-title">
            <h1>{miniInfo.name}</h1>
          </div>
          <div className="miniInfo-grid-item">
            <div className="miniInfo-details">
              <p>Name: {miniInfo.name}</p>
              <p>Rarity: {miniInfo.rarity}</p>
              <p>Gender: {miniInfo.gender}</p>
              <p>Race: {miniInfo.race}</p>
              <p>Size: {miniInfo.size}</p>
              <p>Set Number: {miniInfo.number}</p>
              <p>Quantity: {miniInfo.quantity}</p>
              <p>Maker: {miniInfo.maker}</p>
              <p>Brand: {miniInfo.brand}</p>
              <p>Set: {miniInfo.set}</p>
              <p>
                Statblock:
                <a href={miniInfo.satblock}></a>{" "}
              </p>
            </div>
          </div>

          <div className="miniInfo-grid-item">
            <div
              className={
                miniInfo.set === "Rage of Demons"
                  ? "miniInfo-img-rod"
                  : "miniInfo-img"
              }
            >
              <img src={miniInfo.imageUrls[0]} alt="" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MiniInfo;
