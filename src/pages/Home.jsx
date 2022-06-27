import React from "react";
import { Link } from "react-router-dom";
import MiniGrid from "../components/MiniGrid";
import Filter from "../components/Filter";
import strahd from "../assets/strahd.json";
import getMinis from "../helperFunctions/firebaseGetAllMinis";

class Home extends React.Component {
  constructor() {
    super();
    this.state = { minisList: [], filtersList: [] };
  }

  addFilter(e) {
    const updatedFilteredList = this.state.filtersList;
    updatedFilteredList.push(e);
    this.setState({ filtersList: updatedFilteredList });
  }

  async componentDidMount() {
    const fetchRequest = await getMinis();
    this.setState({ minisList: fetchRequest });
  }

  render() {
    return (
      <>
        <div>
          <Filter addFilter={this.addFilter.bind(this)} />
          <MiniGrid
            displayList={this.state.minisList}
            filtersList={this.state.filtersList}
          />
        </div>
      </>
    );
  }
}

export default Home;
