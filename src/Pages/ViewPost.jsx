import { getPostById } from "../Helpers/APIManager";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Text, Center, Container, Space, Title } from "@mantine/core";
import { CommentList } from "../Components/Posts/Comments/CommentList";
export function ViewPost() {
  const { postId } = useParams();
  const [post, setPost] = useState({});

  useEffect(() => {
    getPostById(postId).then((data) => {
      setPost(data);
    });
  }, [postId]);

  return (
    <Container size="lg">
      <Card withBorder radius="md" p={30}>
        <Card.Section>
          <Center>
            <Text size="xl">{post.title}</Text>
          </Center>
          <Text>{post.text}</Text>
        </Card.Section>
      </Card>
      <Space h={40} />
      <Title order={2}>Comments</Title>
      <Space h={20} />
      <Card withBorder radius="md" p={30}>
        <CommentList postId={postId} />
      </Card>
    </Container>
  );
}
