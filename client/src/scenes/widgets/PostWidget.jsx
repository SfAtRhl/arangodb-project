import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  InputBase,
  Button,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setPost } from "state";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  occupation,
  picturePath,
  userPicturePath,
  likes,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [Comment, setComment] = useState("");

  useEffect(() => {
    getCommentPost();
  }, [Comment]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked =
    likes && loggedInUserId ? Boolean(likes[loggedInUserId]) : false;
  const likeCount = likes ? Object.keys(likes).length : 0;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const getCommentPost = async () => {
    const response = await fetch(
      `http://localhost:3001/posts/${postId.replace("/", "_")}/comment`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    setComments(data);
  };

  const handlePostComment = async () => {
    const response = await fetch(
      `http://localhost:3001/posts/${postId.replace("/", "_")}/comment`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId, comment: Comment }),
      }
    );
    setComment("");
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };
  const patchLike = async () => {
    const response = await fetch(
      `http://localhost:3001/posts/${postId.replace("/", "_")}/like`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      }
    );
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={occupation}
        userPicturePath={userPicturePath}
      />

      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments?.length ?? 0}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {isComments && (
        <Box>
          {comments.length != 0 && (
            <Box
              sx={{
                borderRadius: 1,
                mt: "0.5rem",
                py: "1rem",
                height: "15rem",
                overflow: "auto",
                "&::-webkit-scrollbar": {
                  width: "0.4em",
                  display: "none",
                },
              }}
            >
              {comments.map((commentObj, i) => (
                <Box key={`${i}`} sx={{ pb: "1rem" }}>
                  <Divider />

                  <Box
                    sx={{
                      py: "0.5rem",
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <UserImage
                      image={commentObj.user.picturePath}
                      size="55px"
                    />
                    <Box
                      sx={{ ml: "0.5rem" }}
                      onClick={() => {
                        navigate(
                          `/profile/${commentObj.user.userId.replace("/", "_")}`
                        );
                      }}
                    >
                      <Typography
                        color={main}
                        variant="title1"
                        fontWeight="500"
                        sx={{
                          "&:hover": {
                            color: palette.primary.light,
                            cursor: "pointer",
                          },
                        }}
                      >
                        {commentObj.user.firstName} {commentObj.user.lastName}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        fontWeight="300"
                        sx={{
                          color: main,
                          pl: "1rem",
                        }}
                      >
                        {commentObj.comment.comment}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
              <Divider />
            </Box>
          )}
          <FlexBetween
            sx={{
              gap: "0.25rem",
              mt: "1rem",
            }}
          >
            <InputBase
              placeholder="What's on your mind..."
              onChange={(e) => setComment(e.target.value)}
              value={Comment}
              sx={{
                width: "100%",
                backgroundColor: palette.neutral.light,
                borderRadius: "2rem",
                padding: "0.2rem 0.6rem",
              }}
            />
            <Button
              disabled={!Comment}
              onClick={handlePostComment}
              sx={{
                color: palette.background.main,
                backgroundColor: palette.primary.alt,
                borderRadius: "3rem",
                padding: "0.2rem 0.6rem",
                "&:hover": {
                  color: palette.background.alt,
                  backgroundColor: palette.primary.main,
                  cursor: "pointer",
                },
              }}
            >
              Comment
            </Button>
          </FlexBetween>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
