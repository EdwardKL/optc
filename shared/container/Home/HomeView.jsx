import React from 'react';
import {Grid} from 'react-bootstrap';

class Home extends React.Component {
  constructor(props, context){
    super(props, context);
  }

  render() {
    return(<Grid id="content" />);
  }
}

export default Home;
