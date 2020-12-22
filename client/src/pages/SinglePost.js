import React, { useState, useContext ,useRef} from "react"
import { useQuery  , useMutation} from "@apollo/react-hooks";
import { Form, Button, Card, Grid, Icon, Image, Label } from "semantic-ui-react";
import moment from "moment";
import gql from 'graphql-tag'

import LikeButton from "../components/LikeButton";
import { AuthContext } from "../context/auth";
import DeleteButton from "../components/DeleteButton";

import { Fetch_Posts_Query, FETCH_POST_QUERY } from "../util/graphql";

function SinglePost(props) {
  const { user } = useContext(AuthContext);
  const postId = props.match.params.postId;
  const [errors, setErrors] = useState({});
  const [comment , setComment] = useState('');

const commentInputRef = useRef(null);
  const { data ,error  , loading} = useQuery(FETCH_POST_QUERY, {
    variables: { postId },
  });

const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION,{
    update(){
        setComment('');
        commentInputRef.current.blur();
    },
    variables:{
        postId,
        body:comment
    }
})
function deleteCallBack(){
    props.history.push('/');
}

  let postMarkup;

  if (loading ) {
    postMarkup = <p>Loading post...</p>;
  } else if(!loading){
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount,
    } = data.getPost;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              float="right"
              size="small"
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton
                  post={{ id, likeCount, likes }}
                  user={user}
                ></LikeButton>
                <Button
                  as="div"
                  labelPosition="right"
                  onClick={() => console.log("comment on post")}
                >
                  <Button basic color="blue">
                    <Icon name="comments" />
                    </Button>
                    <Label basic color="blue" pointing="left">
                      {commentCount}
                    </Label>
                </Button>
                 {user && user.username == username && (
                      <DeleteButton postId={id} callback ={deleteCallBack}/>
                    )}
              </Card.Content>
            </Card>
            {user&& (
            <Card fluid>
                <Card.Content>
                 <p>Post a comment</p>
            <Form>
                <div className="ui action input fluid">
                    <input 
                    type='text' 
                    placeholder='post a comment' 
                    name ='comment' 
                    value={comment} 
                    onChange={event=> setComment(event.target.value)}
                    ref = {commentInputRef}
                    />
                    <button type='submit' className='ui button teal'
                    disabled={comment.trim()===''}
                    onClick={submitComment}
                    >Submit</button>
                </div>
            </Form>
            </Card.Content>
            </Card>
            )}
            {comments.map(comment=>(
                <Card fluid key={comment.id}>
                <Card.Content>
                {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId = {comment.id}/>
                )}
                <Card.Header >
                {comment.username}
                </Card.Header>
                <Card.Meta>
                {moment(comment.createdAt).fromNow()}
                </Card.Meta>
                <Card.Description>
                {comment.body}
                </Card.Description>
                </Card.Content>
                </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  return postMarkup;
}
const SUBMIT_COMMENT_MUTATION = gql`
mutation createComment($postId:String! , $body:String!){
    createComment(postId:$postId , body:$body){
        id comments{
            id body createdAt username
        }
        commentCount
    }
}`
export default SinglePost;
