import { useNavigate } from "react-router-dom";
import type { KeyboardEvent } from "react";

const SearchBar = () => {
  const navigate = useNavigate();
  const enterCheck = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      navigate(`/search?term=${e.currentTarget.value}`);
    }
  };

  return (
    <div className="navbar-search-div">
      <input
        onKeyUp={enterCheck}
        type="text"
        placeholder="Search by name of mini"
      />
    </div>
  );
};

export default SearchBar;
