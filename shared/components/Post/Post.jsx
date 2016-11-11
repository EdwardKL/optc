import React, { Component, PropTypes } from 'react';

class Post extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.state.post = props.post_data;
  }

  render() {
    return <div className="post" key={this.state.post.id}>
      {this.state.post.post.content}
    </div>;
  }
}

Post.propTypes = {
  post_data: PropTypes.object.isRequired
};

export default Post;
