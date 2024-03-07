import {
  Image,
  Container,
  Title,
  Button,
  Group,
  Text,
  List,
  ThemeIcon,
  rem,
  Modal,
  Center,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { LoginModal } from "./Login/LoginModal";
import { IconCheck } from "@tabler/icons-react";

export function NotLoggedIn() {
  const [openedModal, { open, close }] = useDisclosure(false);

  return (
    <Center mt={200}>
      <Modal opened={openedModal} onClose={close} title="Log In" centered>
        <LoginModal close={close} />
      </Modal>
      <Group justify="center">
        <Container size="sm" mr={200}>
          <div>
            <div>
              <Title>
                Welcome, to
                <br />
                Cohort Manager
              </Title>
              <Text c="dimmed" mt="md">
                This is a simple and easy to use cohort management system.
              </Text>
              <List
                mt={30}
                spacing="sm"
                size="sm"
                icon={
                  <ThemeIcon size={20} radius="xl">
                    <IconCheck
                      style={{ width: rem(12), height: rem(12) }}
                      stroke={1.5}
                    />
                  </ThemeIcon>
                }
              >
                <List.Item>
                  <b>Posts</b> – Able to create, edit, and delete posts
                </List.Item>
                <List.Item>
                  <b>Comments</b> – Able to create, edit, and delete comments
                </List.Item>
                <List.Item>
                  <b>Friends</b> – Able to add and remove friends
                </List.Item>
                <List.Item>
                  <b>Likes</b> – Able to like or dislike a post
                </List.Item>
              </List>

              <Group mt={30}>
                <Button
                  size="xl"
                  variant="gradient"
                  gradient={{ from: "#000046", to: "#000876" }}
                  onClick={open}
                >
                  Get started
                </Button>
                <Button
                  variant="default"
                  radius="xl"
                  size="md"
                  onClick={() =>
                    (window.location.href =
                      "https://github.com/andreSturesson/react-cohort-dashboard-challenge")
                  }
                >
                  Source code
                </Button>
              </Group>
            </div>
          </div>
        </Container>
        <Container>
          <Image
            src={
              "https://evoseedbox.b-cdn.net/wp-content/uploads/2022/08/saas-3.png"
            }
          />
        </Container>
      </Group>
    </Center>
  );
}
