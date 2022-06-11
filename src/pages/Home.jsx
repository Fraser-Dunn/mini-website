import React from "react";
import { Link } from "react-router-dom";
import MiniGrid from "../components/MiniGrid";
import strahd from "../assets/strahd.json";
import getMinis from "../helperFunctions/firebaseGetAllMinis";

class Home extends React.Component {
  constructor() {
    super();
    this.state = { minisList: [] };
  }

  async componentDidMount() {
    const fetchRequest = await getMinis();
    this.setState({ minisList: fetchRequest });
  }

  render() {
    return (
      <>
        <div>
          <MiniGrid displayList={this.state.minisList} />
        </div>
      </>
    );
  }
}

export default Home;
