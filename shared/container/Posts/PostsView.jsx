import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../redux/actions/actions';
import { Grid, FormGroup, FormControl, Button, Row } from 'react-bootstrap';

export class PostsView extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.state.active_comment = '';
    this.state.location = props.location.split('/').join('!'); // todo refactor this
    this.state.posts = props.posts ? props.posts : [];
    this.state.user = props.user;

    this.dispatch = props.dispatch;

    this.handlePostComment = () => {
      this.dispatch(Actions.addPost(this.state.location, this.state.active_comment));
    };

    this.handleChange = (e) => {
      this.setState({
        active_comment: e.target.value,
      });
    };

  }

  componentWillMount() {
    console.log("calling dispatch to fetch posts");
    this.dispatch(Actions.fetchPosts(this.state.location));
  }

  componentWillReceiveProps(nextProps) {
    console.log('posts component receiving nextprop.posts:', nextProps.posts);
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
      <Grid id="posts">
        <h4>Comments</h4>
        <Row>
          {this.state.posts.map((post) => {
            console.log('boom post: ', post);
            return <div className="post" key={post.id}>
              {post.post.content}
            </div>;
          })}
        </Row>
        <FormGroup controlId="formControlsTextarea" className="postCommentBox">
          <FormControl componentClass="textarea"
                       placeholder="Post a comment here!"
                       value={this.state.active_comment}
                       onChange={this.handleChange}/>
          <Button type="submit"
                  className="postButton"
                  onClick={this.handlePostComment}>
            Post Comment
          </Button>
        </FormGroup>
      </Grid>
    );
  }
}

function mapStateToProps(store) {
  return {
    posts: store.post.posts,
    user: store.account.user
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
