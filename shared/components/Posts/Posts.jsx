import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../../redux/actions/actions';
import { Grid, FormGroup, ControlLabel, FormControl, Button, ListGroup, ListGroupItem } from 'react-bootstrap';

export class Posts extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.state.active_comment = '';
    this.state.location = props.location.split('/').join('!');
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

    this.getPostsJsx = () => {
      let postsJsx = [];
      if (this.state.posts) {
        console.log('posts not undefined: ', this.state.posts);
        for (let i = 0; i < this.state.posts.length; i++) {
          postsJsx.push(
            <Panel header={this.state.posts[i]._user.username}>
              Test Post
            </Panel>
          )
        }
        return postsJsx;
      } else {
        return [];
      }
    }
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
      <FormGroup controlId="formControlsTextarea">
        <FormControl componentClass="textarea"
                     placeholder="Post a comment here!"
                     value={this.state.active_comment}
                     onChange={this.handleChange}/>
        <Button type="submit" onClick={this.handlePostComment}>
          Post Comment
        </Button>
      </FormGroup>
    );
  }
}

function mapStateToProps(store) {
  return {
    posts: store.post.posts,
    user: store.account.user
  };
}

Posts.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object)
};


export default connect(mapStateToProps)(Posts);
