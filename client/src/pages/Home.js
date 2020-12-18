import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Grid } from "semantic-ui-react";
import PostCard from "../components/PostCard";
import wait from "waait";

function Home() {
  const {
    loading,
    data,
    // data: { getPosts: posts },
  } = useQuery(Fetch_Posts_Query1, {
    fetchPolicy: "cache-and-network",
  });
  //console.log(posts);
  const grid = loading ? (
    <h1>loading</h1>
  ) : (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {loading ? (
          <h1>loading posts</h1>
        ) : (
          data.getPosts &&
          data.getPosts.map((post) => (
            <Grid.Column key={post.id} className="card-margin">
              <PostCard post={post} />
            </Grid.Column>
          ))
        )}
      </Grid.Row>
    </Grid>
  );
  return grid;
}

export default Home;
const Fetch_Posts_Query1 = gql`
  query {
    getPosts {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        body
      }
    }
  }
`;
