import React from "react";

const MiniSetCard = (props) => {
  //console.log(props.mini);
  return (
    <>
      <div className="items-center text-center w-[240px] h-[290px] rounded-[2px] px-2 py-2 shadow-lg">
        <div>
          <h1 className="bg-orange-400 text-lg font-semibold rounded-sm text-white hover:cursor-pointer">
            {props.miniSet}
          </h1>
          <p className=" py-1 italic"></p>
        </div>
        <div className=" flex justify-center">
          <img src={props.firstOfSetImg} alt="/" />
        </div>
      </div>
    </>
  );
};

export default MiniSetCard;
