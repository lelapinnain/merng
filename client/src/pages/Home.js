import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";

import { Grid, Transition } from "semantic-ui-react";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { AuthContext } from "../context/auth";

import { Fetch_Posts_Query } from "../util/graphql";
function Home() {
  const { user } = useContext(AuthContext);
  const {
    loading,
    data,
  } = useQuery(Fetch_Posts_Query, {
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
        {user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
        {loading ? (
          <h1>loading posts</h1>
        ) : (
          <Transition.Group>
            {data.getPosts &&
              data.getPosts.map((post) => (
                <Grid.Column key={post.id} className="card-margin">
                  <PostCard post={post} />
                </Grid.Column>
              ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
  return grid;
}

export default Home;
