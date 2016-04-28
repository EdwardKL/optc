import React, {Component, PropTypes} from 'react';
import {Panel, Row, Col, Button} from 'react-bootstrap';

class FriendFinderResult extends Component {
  constructor(props, context){
    super(props, context);
    this.state = {};
    this.state.data = props.data;
  }

  render() {
    return (
      <Panel className="accountPanel">
        <Col xs={2} className="removeLeftPadding">
          {console.log('ffresult data: ', this.state.data)}
          <div className="accountInfo">
            <span className="crewName">{this.state.data.user.display_name}</span>
          </div>
        </Col>
      </Panel>
    )
  }
}

FriendFinderResult.propTypes = {
  data: PropTypes.object.isRequired
};

export default FriendFinderResult;
