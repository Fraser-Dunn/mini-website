const MiniCard = (props) => {
  return (
    <>
      <div className="items-center text-center mt-24 ml-12 max-w-fit outline outline-black px-2 py-2">
        <div>
          <h1>{props.mini.name}</h1>
          <p>{props.mini.size}</p>
        </div>
        <div className=" flex justify-center">
          <img className="w-40" src={props.mini.imageUrls[0]} alt="/" />
        </div>
        <div>
          <p>{props.mini.set}</p>
        </div>
      </div>
    </>
  );
};

export default MiniCard;
