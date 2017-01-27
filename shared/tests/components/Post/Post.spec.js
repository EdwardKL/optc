import expect from 'expect';
import expectJSX from 'expect-jsx';
import { Post } from '../../../components/Post/Post';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { Panel, Button } from 'react-bootstrap';
import POST_VOTE from '../../../../constants/post_vote';


const timeAgo = require('node-time-ago');

expect.extend(expectJSX);

describe('Post', () => {

  const testPost = {
    score: 100,
    location: 'regent',
    content: 'gaia',
    date_added: Date.now,
    _user: {
      username: 'anton'
    }
  };

  const upvotePostVote = {
    vote: POST_VOTE.UPVOTE
  };

  const downvotePostVote = {
    vote: POST_VOTE.DOWNVOTE
  };

  const getExpectedHeaderJSX = (score, post_vote, author, date, logged_in) => {
    return (
      <div className="postHeader">
      <div>
        <Button
          onClick={() => {}}
          active={post_vote === POST_VOTE.UPVOTE}
          disabled={logged_in}
          bsStyle="link"
          className="postUpvote"
        >
          <i className="fa fa-arrow-up" />
        </Button>

        <Button
          onClick={() => {}}
          active={post_vote === POST_VOTE.DOWNVOTE}
          disabled={logged_in}
          bsStyle="link"
          className="postDownvote"
        >
          <i className="fa fa-arrow-down" />
        </Button>
      </div>
      <div className="postScore">{score} points</div>
      <div className="postAuthor"><a href={`/account/${author}`}>{author}</a></div>
      <div className="postTimestamp">{timeAgo(date)}</div>
    </div>
    )};

  it('should render a post with the correct score & no votes', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(<Post post_data={testPost} />);
    const resultOutput = renderer.getRenderOutput();

    // these tests are probably not necessary if we're also testing JSX output, but whatever
    expect(resultOutput.props.children).toEqual(testPost.content);
    expect(resultOutput.type.displayName).toEqual('Panel');

    expect(resultOutput).toEqualJSX(
      <Panel header={getExpectedHeaderJSX(testPost.score, POST_VOTE.NONE, testPost._user.username, Date.now, true)}>
      {testPost.content}
      </Panel>
    );
  });

  it('render upvoted post', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(<Post post_data={testPost} post_vote={upvotePostVote}/>);
    const resultOutput = renderer.getRenderOutput();

    expect(resultOutput).toEqualJSX(
      <Panel header={getExpectedHeaderJSX(testPost.score, POST_VOTE.UPVOTE, testPost._user.username, Date.now, true)}>
        {testPost.content}
      </Panel>
    );
  });

  it('render downvoted post', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(<Post post_data={testPost} post_vote={downvotePostVote}/>);
    const resultOutput = renderer.getRenderOutput();

    expect(resultOutput).toEqualJSX(
      <Panel header={getExpectedHeaderJSX(testPost.score, POST_VOTE.DOWNVOTE, testPost._user.username, Date.now, true)}>
        {testPost.content}
      </Panel>
    );
  });

});
