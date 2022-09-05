import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const navigate = useNavigate();
  const enterCheck = (e) => {
    if (e.key === "Enter") {
      navigate(`/search?term=${e.target.value}`);
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
