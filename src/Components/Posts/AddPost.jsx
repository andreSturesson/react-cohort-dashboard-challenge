import { useState } from "react";
import { Card } from "@mantine/core";
import { userAtom, isLoggedInAtom } from "../../State/auth.state";
import { useAtom } from "jotai";
import { postAtom } from "../../State/posts.state";
import { createPost } from "../../Helpers/APIManager";
import { useDisclosure } from "@mantine/hooks";
import { ExpandableForm } from "../ExpandableForm";

export function AddPost() {
  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  const [opened, { toggle }] = useDisclosure(false);
  const [user] = useAtom(userAtom);
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  const [posts, refreshPosts] = useAtom(postAtom);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("title", title);
    console.log("value", value);
    console.log("Making a post...");
    if (value === "") return;
    if (opened && title === "") return;

    const newPost = await createPost({
      title: title,
      text: value,
    });

    refreshPosts();
    setValue("");
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
              value={value}
              setValue={setValue}
              title={title}
              setTitle={setTitle}
            />
          </Card>
        </>
      )}
    </>
  );
}
