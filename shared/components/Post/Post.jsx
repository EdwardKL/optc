import React, { Component, PropTypes } from 'react';
import { Panel, Button} from 'react-bootstrap';
import { connect } from 'react-redux';
import * as Actions from '../../redux/actions/actions';
import { browserHistory } from 'react-router';
import POST_VOTE from '../../../constants/post_vote';

const timeAgo = require('node-time-ago');

export class Post extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.state.post = props.post_data;

    this.state.redirect_location = props.redirect_location ? props.redirect_location : '';
    this.state.user = props.user;
    this.state.post_vote = props.post_vote;

    this.dispatch = props.dispatch;

    if (this.state.user) {
      console.log('dispatching to fetch post vote');
      this.dispatch(Actions.fetchPostVote(this.state.post._id, this.state.user._id));
    }

    this.handleUpvote = () => {
      this.dispatch(Actions.togglePostVote(this.state.post._id, Boolean(true)));
    };

    this.handleDownvote = () => {
      this.dispatch(Actions.togglePostVote(this.state.post._id, Boolean(false)));
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.redirect_location) {
      browserHistory.push(`/${nextProps.redirect_location}?se`);
    } else {
      if (nextProps.post_vote && nextProps.post_vote.post_id == this.state.post._id) {
        this.setState({
          post_vote: nextProps.post_vote,
        });
      }
      if (nextProps.updated_post && nextProps.updated_post._id == this.state.post._id) {
        this.setState({
          post: nextProps.updated_post,
        });
      }
    }
  }


  render() {
    const commentHeader = (
      <div className="postHeader">
        <div>
          <Button
            onClick={this.handleUpvote}
            active={this.state.post_vote && this.state.post_vote.vote === POST_VOTE.UPVOTE}
            disabled={!this.state.user}
            bsStyle="link"
            className="postUpvote"
          >
            <i className="fa fa-arrow-up" />
          </Button>

          <Button
            onClick={this.handleDownvote}
            active={this.state.post_vote && this.state.post_vote.vote === POST_VOTE.DOWNVOTE}
            disabled={!this.state.user}
            bsStyle="link"
            className="postDownvote"
          >
            <i className="fa fa-arrow-down" />
          </Button>
        </div>
        <div className="postScore">{this.state.post.score} points</div>
        <div className="postAuthor"><a href={`/account/${this.state.post._user.username}`}>{this.state.post._user.username}</a></div>
        <div className="postTimestamp">{timeAgo(this.state.post.date_added)}</div>
      </div>
    );

    return (<Panel header={commentHeader}>
      {this.state.post.content}
    </Panel>);
  }
}

function mapStateToProps(store) {
  return {
    // post_data: store.post.post_data,
    updated_post: store.post.post_data,
    post_vote: store.post.post_vote,
    redirect_location: store.post.redirect_location,
    user: store.identity.user,
  };
}

Post.propTypes = {
  post_data: PropTypes.object.isRequired,
  dispatch: PropTypes.func,
  user: PropTypes.object,
  children: PropTypes.array,
};

export default connect(mapStateToProps)(Post);
