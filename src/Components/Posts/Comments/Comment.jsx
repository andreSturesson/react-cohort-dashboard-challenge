import {
  Avatar,
  Group,
  Text,
  Container,
  Space,
  Card,
  Loader,
} from "@mantine/core";
import {
  IconThumbUp,
  IconThumbUpFilled,
  IconThumbDown,
  IconThumbDownFilled,
} from "@tabler/icons-react";
import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { likePost, unlikePost } from "../../../Helpers/APIManager";
export function Comment({ comment }) {
  const created = new Date(comment.created);
  const date =
    created.getMonth() +
    1 +
    "/" +
    created.getDate() +
    "/" +
    created.getFullYear();

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const handleLike = () => {
    if (!liked) {
      likePost(comment.id);
      setLiked(true);
      if (disliked) {
        unlikePost(comment.id);
        setDisliked(false);
      }
    } else {
      unlikePost(comment.id);
      setLiked(false);
    }
  };

  const handleDislike = () => {
    if (!disliked) {
      unlikePost(comment.id);
      setDisliked(true);
      if (liked) {
        unlikePost(comment.id);
        setLiked(false);
      }
    } else {
      unlikePost(comment.id);
      setDisliked(false);
    }
  };

  return (
    <>
      <Container padding="lg" w={800}>
        {comment.account ? (
          <>
            <Group justify="flex-start">
              <Link to={`/profile/${comment.account.id}`}>
                <Avatar
                  src={comment.account.profilePicture}
                  alt={`${comment.account.firstName} ${comment.account.lastName}`}
                  radius="xl"
                />
              </Link>
              <Container ml={0}>
                <Link to={`/profile/${comment.account.id}`}>
                  <Text size="xs" fw={700} ta={"left"}>
                    {comment.account.firstName} {comment.account.lastName}
                  </Text>
                </Link>
                <Text size="xs" fz={12} c={"dimmed"}>
                  {date}
                </Text>
                <Text size="sm">{comment.text}</Text>
              </Container>
              <Container mr={0}>
                <Group justify="flex-end">
                  <Text size="sm" c="dimmed">
                    {comment.likes}{" "}
                    {liked ? (
                      <IconThumbUpFilled onClick={handleLike} />
                    ) : (
                      <IconThumbUp onClick={handleLike} />
                    )}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {comment.dislikes}{" "}
                    {disliked ? (
                      <IconThumbDownFilled onClick={handleDislike} />
                    ) : (
                      <IconThumbDown onClick={handleDislike} />
                    )}
                  </Text>
                </Group>
              </Container>
            </Group>
          </>
        ) : (
          <Loader />
        )}
        <Space h={10} />
      </Container>
      <Space h={10} />
    </>
  );
}

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
};
