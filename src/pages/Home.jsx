import React from "react";
import SetCardGrid from "../components/SetCardGrid";
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
          <SetCardGrid displayList={this.state.minisList} />
        </div>
      </>
    );
  }
}

export default Home;
