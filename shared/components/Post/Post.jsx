import React, { Component, PropTypes } from 'react';
import { Panel, Col, Button, Input } from 'react-bootstrap';
import { connect } from 'react-redux';
import moment from 'moment';
import * as Actions from '../../redux/actions/actions';
import { browserHistory } from 'react-router';
import POST_VOTE from '../../../constants/POST_VOTE';

class Post extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this.state.post = props.post_data;

    this.state.redirect_location = props.redirect_location ? props.redirect_location : '';
    this.state.user = props.user;
    this.state.post_vote = props.post_vote;

    this.state.date_format = "MMMM Do YYYY, h:mm:ss a";
    this.state.post_date = moment(this.state.post.date_added);

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
      browserHistory.push('/' + nextProps.redirect_location + '?se');
    } else {
      if (nextProps.post_vote && nextProps.post_vote.post_id == this.state.post._id) {
        this.setState({
          post_vote: nextProps.post_vote
        });
      }
      if (nextProps.updated_post && nextProps.updated_post._id == this.state.post._id) {
        this.setState({
          post: nextProps.updated_post
        });
      }
    }
  }


  render() {
    const commentHeader = (
      <div>
        <Col xs={2} md={1}>{this.state.post._user.username}</Col>
        <Col md={2}>

          <Button onClick={this.handleUpvote}
                  active={this.state.post_vote && this.state.post_vote.vote == POST_VOTE.UPVOTE}
                  disabled={!this.state.user}>
            <i className="fa fa-arrow-up"/>
          </Button>

          <Button onClick={this.handleDownvote}
                  active={this.state.post_vote && this.state.post_vote.vote == POST_VOTE.DOWNVOTE}
                  disabled={!this.state.user}>
            <i className="fa fa-arrow-down"/>
          </Button>

        </Col>
        <Col xs={2} md={1}>{this.state.post.score} points</Col>
        <Col>{this.state.post_date.format(this.state.date_format)}</Col>
      </div>
    );

    return <Panel header={commentHeader}>
      {this.state.post.content}
    </Panel>;

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
