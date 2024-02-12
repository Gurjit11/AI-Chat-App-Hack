const Header = () => {
  return (
    <div className="self-stretch flex flex-row items-center justify-between text-left text-mini p-3 bg-gradient-to-b from-black via to-blue-950 text-black ">
      <div className="flex  justify-center items-center">
        {/* <div className=" h-11 overflow-hidden">
          <img
            className=" h-[42px] object-cover"
            alt=""
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-mVmlEwPD_VEEhIJJc8mTmP1i6vnH7Q0kvw&usqp=CAU"
          />
        </div> */}
        <div className="text-2xl ml-2 rounded-full font-bold bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
          VideoQuery
        </div>
      </div>
    </div>
  );
};

export default Header;
