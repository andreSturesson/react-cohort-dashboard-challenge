import { useState } from "react";
import {
  Avatar,
  Group,
  Text,
  Card,
  Space,
  Container,
  Divider,
  Center,
} from "@mantine/core";
import { CommentList } from "./Comments/CommentList";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  IconThumbUp,
  IconThumbUpFilled,
  IconThumbDown,
  IconThumbDownFilled,
} from "@tabler/icons-react";
import { likePost, unlikePost } from "../../Helpers/APIManager";
import { userAtom } from "../../State/auth.state";
import { useAtom } from "jotai";
export function Post({ post }) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [dislikes, setDislikes] = useState(post.dislikes);
  const [user] = useAtom(userAtom);

  console.log("Post: ", post);
  console.log("User: ", user);

  const handleLike = () => {
    if (!liked) {
      likePost(post.id);
      setLiked(true);
      if (disliked) {
        unlikePost(post.id);
        setDisliked(false);
      }
      setLikes(likes + 1);
    } else {
      unlikePost(post.id);
      setLiked(false);
      setLikes(likes - 1);
    }
  };

  const handleDislike = () => {
    if (!disliked) {
      unlikePost(post.id);
      setDisliked(true);
      if (liked) {
        unlikePost(post.id);
        setLiked(false);
      }
      setDislikes(dislikes + 1);
    } else {
      unlikePost(post.id);
      setDisliked(false);
      setDislikes(dislikes - 1);
    }
  };

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="flex-start">
          <Link to={`/profile/${post.account.id}`}>
            <Avatar src={post.account.profilePicture} radius="xl" />
          </Link>
          <div>
            <Link to={`/profile/${post.account.id}`}>
              <Text size="sm" fw={700} ta={"left"}>
                {post.account.firstName} {post.account.lastName}
              </Text>
            </Link>
            <Text size="xs" c="dimmed">
              <Link to={`/posts/${post.id}`}>{post.title}</Link>
            </Text>
          </div>
          <Container mr={0}>
            <Card withBorder>
              <Group justify="flex-end">
                <Text size="sm" c="dimmed">
                  {liked ? (
                    <IconThumbUpFilled onClick={handleLike} />
                  ) : (
                    <IconThumbUp onClick={handleLike} />
                  )}
                  <Center>{likes}</Center>{" "}
                </Text>
                <Text size="sm" c="dimmed">
                  {disliked ? (
                    <IconThumbDownFilled onClick={handleDislike} />
                  ) : (
                    <IconThumbDown onClick={handleDislike} />
                  )}
                  <Center>{dislikes}</Center>
                </Text>
              </Group>
            </Card>
          </Container>
        </Group>
        <Text pl={54} pt="sm" size="sm" ta={"left"}>
          {post.text}
        </Text>
        <Divider label="Comment Section" labelPosition="center" my="lg" />
        <Card padding="lg" radius="md">
          <CommentList postId={post.id} />
        </Card>
      </Card>
      <Space h={10} />
    </>
  );
}

Post.propTypes = {
  post: PropTypes.object.isRequired,
};
