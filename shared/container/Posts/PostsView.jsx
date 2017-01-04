import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../redux/actions/actions';
import { Input, Button, Row } from 'react-bootstrap';
import Post from '../../components/Post/Post';

export class PostsView extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.state.active_comment = '';
    this.state.location = props.location.split('/').join('!'); // todo refactor this
    this.state.posts = props.posts ? props.posts : [];
    this.state.user = props.user;

    this.dispatch = props.dispatch;

    this.handleChange = (e) => {
      this.setState({
        active_comment: e.target.value,
      });
    };

  }

  componentWillMount() {
    this.dispatch(Actions.fetchPosts(this.state.location));
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      posts: nextProps.posts,
      update: true
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.update;
  }

  render() {
    return (
      <div>
        <Row>
          <h4>Comments</h4>
        </Row>
        <Row>
          {this.state.posts.map((post_obj) => {
            return <Post post_data={post_obj.post} key={post_obj.post._id}/>
          })}
        </Row>
        <Row>
          <form action="/posts/api/post" method="POST">
            <Input type="textarea"
                   placeholder="Post a comment here!"
                   value={this.state.active_comment}
                   onChange={this.handleChange}
                   name="post_content"/>
            <Input type="hidden"
                   value={this.state.location}
                   name="location"/>
            <Button type="submit"
                    className="postButton"
                    disabled= {!this.state.user || !this.state.active_comment}>
              Post Comment
            </Button>
          </form>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    posts: store.post.posts,
    user: store.identity.user
  };
}

PostsView.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.object,
    _user: PropTypes.object,
    location: PropTypes.string,
    content: PropTypes.string,
    _v: PropTypes.number,
    score: PropTypes.number,
    date_added: PropTypes.instanceOf(Date),
    children: PropTypes.array
  }))
};

export default connect(mapStateToProps)(PostsView);
