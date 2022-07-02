import React from "react";
import MiniGrid from "../components/MiniGrid";
import Filter from "../components/Filter";
import getMinis from "../helperFunctions/firebaseGetAllMinis";

class Gallery extends React.Component {
  constructor() {
    super();
    this.state = { minisList: [], filtersList: [] };
  }

  addFilter(newFilter) {
    // add validation to apply filter once
    const updatedFilteredList = this.state.filtersList;
    updatedFilteredList.push(newFilter);
    this.setState({ filtersList: updatedFilteredList });
  }

  removeFilter(filterToBeRemoved) {
    const updatedFilteredList = this.state.filtersList.filter((filter) => {
      return (
        filter.key !== filterToBeRemoved.key ||
        filter.value !== filterToBeRemoved.value
      );
    });
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
          <Filter
            displayList={this.state.minisList}
            addFilter={this.addFilter.bind(this)}
            removeFilter={this.removeFilter.bind(this)}
          />
          <MiniGrid
            displayList={this.state.minisList}
            filtersList={this.state.filtersList}
          />
        </div>
      </>
    );
  }
}

export default Gallery;
