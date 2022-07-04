import { Link } from "react-router-dom";

const MiniCard = (props) => {
  return (
    <>
      <div className="miniCard-main-div shadow-lg">
        <div>
          <Link to={`/miniInfo/${props.mini.id}`}>
            <h1>{props.mini.name}</h1>
          </Link>
          <p className="miniCard-size-p">{props.mini.size}</p>
        </div>
        <div className="miniCard-img-div">
          <Link to={`/miniInfo/${props.mini.id}`}>
            <img
              className="miniCard-img"
              src={props.mini.imageUrls[0]}
              alt="/"
            />
          </Link>
        </div>
        <div>
          <p className="miniCard-set-and-number-p">
            <b>{props.mini.set}</b> {""} (<em>{props.mini.number}</em>)
          </p>
        </div>
      </div>
    </>
  );
};

export default MiniCard;
