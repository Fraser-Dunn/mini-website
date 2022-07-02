import React from "react";
import MiniCardGrid from "../components/MiniCardGrid";
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
          <MiniCardGrid displayList={this.state.minisList} />
        </div>
      </>
    );
  }
}

export default Home;
