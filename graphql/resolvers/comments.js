const Post = require("../../models/post");
const checkAuth = require("../../util/check-auth");
const { UserInputError, AuthenticationError } = require("apollo-server");

module.exports = {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      const { username } = checkAuth(context);
      if (body.trim() === "") {
        throw new UserInputError("Empty comment", {
          errors: {
            body: "Comment body must not be empty",
          },
        });
      }

      const post = await Post.findById(postId);
      if (post) {
        //unshift to add the new post to the begining of the array
        post.comments.unshift({
          body,
          createdAt: new Date().toISOString(),
          username,
        });
        await post.save();
        return post;
      } else {
        throw new UserInputError("Post not found");
      }
    },
    deleteComment: async (_, { postId, commentId }, context) => {
      const { username } = checkAuth(context);

      try {
        const posts = await Post.findById(postId);
        console.log(posts);
        if (posts) {
          const commentIndex = posts.comments.findIndex(
            (c) => c.id === commentId
          );
          if (commentIndex != -1) {
            if (posts.comments[commentIndex].username === username) {
              posts.comments.splice(commentIndex, 1);
              await posts.save();
              return posts;
            } else {
              throw new AuthenticationError("Action not allowed");
            }
          } else {
            throw new AuthenticationError("Comment not found");
          }
        } else {
          throw new UserInputError("Post not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};
