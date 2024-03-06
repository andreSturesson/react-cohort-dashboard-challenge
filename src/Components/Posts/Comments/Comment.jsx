import {
  Avatar,
  Group,
  Text,
  Container,
  Space,
  Card,
  Loader,
} from "@mantine/core";
import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";
export function Comment({ comment }) {
  return (
    <Container size="sm" ml={0}>
      {comment.account ? (
        <Group position="left">
          <Link to={`/profile/${comment.account.id}`}>
            <Avatar
              src={comment.account.profileImage}
              alt={`${comment.account.firstName} ${comment.account.lastName}`}
              radius="xl"
            />
          </Link>
          <div>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Link to={`/profile/${comment.account.id}`}>
                <Text size="xs" fw={700} ta={"left"}>
                  {comment.account.firstName} {comment.account.lastName}
                </Text>
              </Link>
              <Text size="sm" c="dimmed">
                {comment.text}
              </Text>
            </Card>
          </div>
        </Group>
      ) : (
        <Loader />
      )}
      <Space h={10} />
    </Container>
  );
}

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
};
