import React from "react";
import MiniGrid from "../components/MiniGrid";
import Filter from "../components/Filter";

class Gallery extends React.Component {
  constructor() {
    super();
    this.state = { filtersList: [] };
  }

  addFilter(newFilter) {
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

  render() {
    return (
      <>
        <div>
          <Filter
            displayList={this.props.data}
            addFilter={this.addFilter.bind(this)}
            removeFilter={this.removeFilter.bind(this)}
          />
          <MiniGrid
            displayList={this.props.data}
            filtersList={this.state.filtersList}
          />
        </div>
      </>
    );
  }
}

export default Gallery;
