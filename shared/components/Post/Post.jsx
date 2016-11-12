import React, { Component, PropTypes } from 'react';
import { Panel } from 'react-bootstrap';

class Post extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.state.post = props.post_data.post;
    this.state.children = props.post_data.children;
  }

  render() {
    return (<Panel header={this.state.post._user.username}>
      {this.state.post.content}
    </Panel>);
  }
}

Post.propTypes = {
  post_data: PropTypes.object.isRequired,
  children: PropTypes.array,
};

export default Post;
