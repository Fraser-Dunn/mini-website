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

  return (
    <>
      <div className="miniInfo-page-container">
        <div className="miniInfo-card">
          <div className="miniInfo-title">
            <h1>{miniInfo.name}</h1>
          </div>
          <div className="miniInfo-grid shadow-lg">
            <div className="miniInfo-container">
              <div className="miniInfo-info-div">
                <p>Name: {miniInfo.name}</p>
              </div>
              <div className="miniInfo-info-div">
                <p>Rarity: {miniInfo.rarity}</p>
              </div>
              <div className="miniInfo-info-div">
                <p>Size: {miniInfo.size}</p>
              </div>
              <div className="miniInfo-info-div">
                <p>Set Number: {miniInfo.number}</p>
              </div>
              <div className="miniInfo-info-div">
                <p>Maker: {miniInfo.maker}</p>
              </div>
              <div className="miniInfo-info-div">
                <p>Brand: {miniInfo.brand}</p>
              </div>
              <div className="miniInfo-info-div">
                <p>Set: {miniInfo.set}</p>
              </div>
            </div>
            <div className="miniInfo-image-div">
              <img
                className="miniInfo-image"
                src={miniInfo.imageUrls[0]}
                alt="/"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MiniInfo;
