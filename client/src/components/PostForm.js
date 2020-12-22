import React, { useState } from "react";
import { Button, Form, Transition } from "semantic-ui-react";
import { useForm } from "../util/hooks";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { Fetch_Posts_Query } from "../util/graphql";
import { cloneDeep } from "lodash";

function PostForm() {
  const [errors, setErrors] = useState({});
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: "",
  });
  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = cloneDeep(
        proxy.readQuery({
          query: Fetch_Posts_Query,
          variables: {
            body: values.body,
          },
        })
      );
      data.getPosts = [result.data.createPost, ...data.getPosts];
      proxy.writeQuery({
        query: Fetch_Posts_Query,
        variables: {
          body: values.body,
        },
        data: { ...data },
      });
      values.body = "";
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
  });
  function createPostCallback() {
    createPost();
  }
  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a post :</h2>
        <Form.Field>
          <Form.Input
            placeholder="hi world"
            type="text"
            name="body"
            error={error ? true : false}
            onChange={onChange}
            value={values.body}
          />
          <Button type="submit" color="teal">
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: "20px" }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        createdAt
      }
      commentCount
    }
  }
`;
export default PostForm;
