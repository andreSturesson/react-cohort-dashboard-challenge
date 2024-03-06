import { Avatar, Group, Text, Card, Space, Badge } from "@mantine/core";
import { CommentList } from "./Comments/CommentList";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
export function Post({ post }) {
  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="flex-start">
          <Link to={`/profile/${post.account.id}`}>
            <Avatar src={post.account.profileImage} radius="xl" />
          </Link>
          <div>
            <Link to={`/profile/${post.account.id}`}>
              <Text size="sm" fw={700} ta={"left"}>
                {post.account.firstName} {post.account.lastName}
              </Text>
            </Link>
            <Text size="xs" c="dimmed">
              {post.title}
            </Text>
          </div>
        </Group>
        <Text pl={54} pt="sm" size="sm" ta={"left"}>
          {post.text}
        </Text>
        <Space h={10} />
        <CommentList postId={post.id} />
      </Card>
      <Space h={10} />
    </>
  );
}

Post.propTypes = {
  post: PropTypes.object.isRequired,
};
