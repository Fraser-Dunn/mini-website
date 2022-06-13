const MiniCard = (props) => {
  return (
    <>
      <div className="items-center text-center w-[240px] h-[260px] rounded-[2px] px-2 py-2 shadow-lg">
        <div>
          <h1 className="bg-orange-400 text-lg font-semibold rounded-sm text-white hover:cursor-pointer">
            {props.mini.name}
          </h1>
          <p className=" py-1 italic">{props.mini.size}</p>
        </div>
        <div className=" flex justify-center">
          <img
            className="w-40 hover:cursor-pointer"
            src={props.mini.imageUrls[0]}
            alt="/"
          />
        </div>
        <div>
          <p className="hover:underline hover:cursor-pointer pt-1 font-semibold">
            {props.mini.set}
          </p>
        </div>
      </div>
    </>
  );
};

export default MiniCard;
