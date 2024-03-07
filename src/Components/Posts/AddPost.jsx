import { useState } from "react";
import { Card } from "@mantine/core";
import { userAtom, isLoggedInAtom } from "../../State/auth.state";
import { useAtom } from "jotai";
import { postAtom } from "../../State/posts.state";
import { createPost } from "../../Helpers/APIManager";
import { useDisclosure } from "@mantine/hooks";
import { ExpandableForm } from "../ExpandableForm";

export function AddPost() {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [opened, { toggle }] = useDisclosure(false);
  const [user] = useAtom(userAtom);
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const [posts, refreshPosts] = useAtom(postAtom);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (text === "") return;
    if (opened && title === "") return;

    const newPost = await createPost({
      title: title,
      text: text,
    });

    refreshPosts();
    setText("");
    setTitle("");
    toggle();
  };

  return (
    <>
      {isLoggedIn && (
        <>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <ExpandableForm
              handleSubmit={handleSubmit}
              opened={opened}
              toggle={toggle}
              text={text}
              setText={setText}
              title={title}
              setTitle={setTitle}
            />
          </Card>
        </>
      )}
    </>
  );
}
