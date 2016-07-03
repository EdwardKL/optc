import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';

class Unit extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.state.id = props.id;
    this.state.thumb_url = 'http://onepiece-treasurecruise.com/wp-content/uploads/f' + String('0000' + props.id).slice(-4) + '.png';
    this.state.backgroundStyle = {
      backgroundImage: `url(${this.state.thumb_url})`,
    };
  }

  render() {
    return (<Button bsStyle="link" href={`/unit/${this.state.id}`}>
      <div className="unitThumb">
        <div className="unitThumbImage" style={this.state.backgroundStyle}>
          <span className="unitThumbId">#{this.state.id}</span>
        </div>
      </div>
    </Button>);
  }
}

Unit.propTypes = {
  id: PropTypes.number.isRequired,
};

export default Unit;
