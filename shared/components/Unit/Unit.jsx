import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { wrapText, getUnitThumbnailUrl } from '../../utils';

class Unit extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.state.id = props.id;
    this.state.name = props.name;
    this.state.backgroundStyle = { backgroundImage: getUnitThumbnailUrl(props.id) };
  }

  render() {
    return (<Button bsStyle="link" href={`/unit/${this.state.id}/${this.state.name.replace(/[/.]/g, '').replace(/[ ]/g, '_').trim()}`}>
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
