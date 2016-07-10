import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { wrapText } from '../../utils';

class Unit extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.state.id = props.id;
    this.state.name = props.name;
    this.state.thumb_url = 'http://onepiece-treasurecruise.com/wp-content/uploads/f' + String('0000' + props.id).slice(-4) + '.png';
    this.state.backgroundStyle = {
      backgroundImage: `url(${this.state.thumb_url})`,
    };
  }

  render() {
    return (<Button bsStyle="link" href={`/unit/${this.state.id}`}>
      <div className="unitThumb">
        <span className="unitThumbName">{wrapText(this.state.name)}</span>
        <div className="unitThumbImage" style={this.state.backgroundStyle}>
          <span className="unitThumbId">#{this.state.id}</span>
        </div>
      </div>
    </Button>);
  }
}

Unit.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
};

export default Unit;
