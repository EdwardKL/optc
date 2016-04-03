import React, {Component, PropTypes} from 'react';
import {Panel, Row, Col, Button} from 'react-bootstrap';
import CaptainEditor from '../../components/Captain/CaptainEditor';

class Captain extends Component {
  constructor(props, context){
    super(props, context);
    this.state = {};
    this.state.captain_data = props.captain_data;
    this.state.account_id = props.account_id;
  }
  
  render() {
    return (
      <Panel>
        <Col xs={4}>
          <h3>{this.state.captain_data._unit}</h3>
        </Col>
        <Col xs={7}>
          <Row><b>Level:</b>{this.state.captain_data.current_level}</Row>
          <Row><b>Special Level:</b>{this.state.captain_data.current_special_level}</Row>
          {this.state.captain_data.current_sockets.map(function(socket) {
            return <Row>{socket._socket}, {socket.socket_level}</Row>;
          })}
        </Col>
        <Col xs={1}>
          <Row>
            <CaptainEditor
              edit={true}
              account_id={this.state.account_id}
              unit_id={this.state.captain_data._unit}
              default_level={this.state.captain_data.current_level}
              default_special={this.state.captain_data.current_special_level}
              default_sockets={this.state.captain_data.current_sockets}
              />
          </Row>
          <Row><a href={"/captains/delete/id".replace("id",this.state.captain_data._id)}>Delete</a></Row>
        </Col>
      </Panel>
    )
  }
}

Captain.propTypes = {
  account_id: PropTypes.number.isRequired,
  captain_data: PropTypes.object.isRequired,
};

export default Captain;
