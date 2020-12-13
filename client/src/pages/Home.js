import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Grid } from "semantic-ui-react";
import PostCard from "../components/PostCard";

function Home() {
  const {
    loading,
    data: { getPosts: posts },
  } = useQuery(Fetch_Posts_Query);

  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {loading ? (
          <h1>loading posts</h1>
        ) : (
          posts &&
          posts.map((post) => (
            <Grid.Column key={post.id} className="card-margin">
              <PostCard post={post} />
            </Grid.Column>
          ))
        )}
      </Grid.Row>
    </Grid>
  );
}

export default Home;

const Fetch_Posts_Query = gql`
  {
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
