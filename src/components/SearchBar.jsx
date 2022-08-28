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
      <input onKeyUp={enterCheck} type="text" placeholder="Search here..." />
    </div>
  );
};

export default SearchBar;

// Create a search page

// 1. search input (Done)
// 2. reroute to search page (Done)
// 3. grab parameter
// 4. filter list
