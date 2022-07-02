import { Link } from "react-router-dom";

const MiniCard = (props) => {
  return (
    <>
      <div className="items-center text-center w-[240px] h-[290px] rounded-[2px] px-2 py-2 shadow-lg">
        <div>
          <Link to={`/miniInfo/${props.mini.id}`}>
            <h1 className="bg-orange-400 text-lg font-semibold rounded-sm text-white hover:cursor-pointer">
              {props.mini.name}
            </h1>
          </Link>
          <p className=" py-1 italic">{props.mini.size}</p>
        </div>
        <div className=" flex justify-center">
          <Link to={`/miniInfo/${props.mini.id}`}>
            <img
              className="w-40 hover:cursor-pointer"
              src={props.mini.imageUrls[0]}
              alt="/"
            />
          </Link>
        </div>
        <div>
          <p className="hover:underline hover:cursor-pointer pt-1">
            <b className="font-semibold">{props.mini.set}</b> {""} (
            <em>{props.mini.number}</em>)
          </p>
        </div>
      </div>
    </>
  );
};

export default MiniCard;
