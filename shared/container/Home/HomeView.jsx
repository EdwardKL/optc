import React from 'react';
import Header from '../../components/Header/Header';

class Home extends React.Component {
  constructor(props, context){
    super(props, context);
  }

  render() {
    return (
      <div>
        <Header />
      </div>
    );
  }
}

export default Home;
