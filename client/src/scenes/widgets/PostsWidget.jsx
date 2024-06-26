import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";
import { Box, Typography, useMediaQuery } from "@mui/material";
import FlexCenter from "components/FlexCenter";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  const getPosts = async () => {
    const response = await fetch("http://localhost:3001/posts", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      console.error(
        `HTTP error! Status: ${response.status}, Message: ${errorMessage}`
      );
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    dispatch(setPosts({ posts: data }));
  };

  const getUserPosts = async () => {
    const response = await fetch(
      `http://localhost:3001/posts/${userId.replace("/", "_")}/posts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []); 

  return (
    <>
      <Box
        height={isNonMobileScreens ? "30rem" : "100%"}
        // sx={{
        //   borderRadius: 1,
        //   overflow: "auto",
        //   "&::-webkit-scrollbar": {
        //     width: "0.4em",
        //     display: "none",
        //   },
        // }}
      >
        {Array.isArray(posts) ? (
          posts.map(
            ({
              _id,
              userId,
              firstName,
              lastName,
              description,
              location,
              occupation,
              picturePath,
              userPicturePath,
              likes,
              comments,
            }) => (
              <PostWidget
                key={_id}
                postId={_id}
                postUserId={userId}
                name={`${firstName} ${lastName}`}
                description={description}
                location={location}
                occupation={occupation}
                picturePath={picturePath}
                userPicturePath={userPicturePath}
                likes={likes}
                comments={comments}
              />
            )
          )
        ) : (
          <FlexCenter gap="1.5rem">
            <Typography>No posts available.</Typography>
          </FlexCenter>
        )}
      </Box>
    </>
  );
};

export default PostsWidget;
