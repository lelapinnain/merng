import React, { useState } from "react";
import gql from "graphql-tag";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { Button, Icon, Confirm } from "semantic-ui-react";
import { Fetch_Posts_Query } from "../util/graphql";
import { useForm } from "../util/hooks";
import { cloneDeep } from "lodash";

function DeleteButton({ postId , commentId , callback}) {
  const [confrimOpen, setConfirmOpen] = useState(false);
  const mutation = commentId?DELETE_COMMENT_MUTATION:DELETE_POST_MUTATION;
  const { values } = useForm(deletePostCallback, {
    body: "",
  });
  const [deletePostOrComment] = useMutation(mutation, {
    update(proxy, result) {
      setConfirmOpen(false);

      if(!commentId){
        const data = cloneDeep(
        proxy.readQuery({
          query: Fetch_Posts_Query,
          variables: {
            body: values.body,
          },
        })
      );

      data.getPosts = data.getPosts.filter((post) => post.id !== postId);
      console.log(data);
      proxy.writeQuery({
        query: Fetch_Posts_Query,
        variables: {
          body: values.body,
        },
        data: { ...data },
      });
      if (callback) callback();
      }
    },
    variables: {
      postId,
      commentId
    },
  });
  function deletePostCallback() {
    deletePostOrComment();
  }
  return (
    <>
      <Button
        as="div"
        color="red"
        floated="right"
        onClick={() => setConfirmOpen(true)}
      >
        <Icon name="trash" style={{ margin: 0 }} />
      </Button>
      <Confirm
        open={confrimOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrComment}
      ></Confirm>
    </>
  );
}

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;
const DELETE_COMMENT_MUTATION = gql`
mutation deleteComment($postId :ID! , $commentId:ID!){
  deleteComment(postId:$postId , commentId:$commentId){
    id
    comments{
      id createdAt body username
    }
    commentCount
  }
}`

export default DeleteButton;
