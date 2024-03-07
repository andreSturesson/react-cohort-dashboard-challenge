import { Container, Space } from "@mantine/core";
import { AddPost } from "../Components/Posts/AddPost";
import { PostList } from "../Components/Posts/PostList";
import { isLoggedInAtom } from "../State/auth.state";
import { useAtom } from "jotai";
import { NotLoggedIn } from "../Components/NotLoggedIn";
export function HomePage() {
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  return (
    <>
      <Container size="lg">
        <Space h={35} />
        {isLoggedIn ? (
          <>
            <AddPost />
            <Space h={35} />
            <PostList />
          </>
        ) : (
          <NotLoggedIn />
        )}
      </Container>
    </>
  );
}
