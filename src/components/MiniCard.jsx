import { Link } from "react-router-dom";

const MiniCard = ({ mini }) => {
  return (
    <>
      <div className="miniCard-main-div">
        <div>
          <Link to={`/miniInfo/${mini.id}`}>
            <h1>{mini.name}</h1>
          </Link>
          <p className="miniCard-size-p">{mini.size}</p>
        </div>
        <div className="miniCard-img-div">
          <Link to={`/miniInfo/${mini.id}`}>
            <img className="miniCard-img" src={mini.imageUrls[0]} alt="/" />
          </Link>
        </div>
        <div>
          <p className="miniCard-set-and-number-p">
            <b>{mini.set}</b> {""} (<em>{mini.number}</em>)
          </p>
        </div>
      </div>
    </>
  );
};

export default MiniCard;
