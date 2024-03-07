import { TextInput, rem, Avatar, ActionIcon, Collapse } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import PropTypes from "prop-types";
import { userAtom } from "../State/auth.state";
import { useAtom } from "jotai";

export function ExpandableForm({
  handleSubmit,
  opened,
  toggle,
  text,
  setText,
  title,
  setTitle,
}) {
  const [user] = useAtom(userAtom);

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        value={title}
        onChange={(event) => setTitle(event.currentTarget.value)}
        radius="xl"
        size="md"
        onClick={toggle}
        placeholder={opened ? "Title" : "What's on your mind?"}
        rightSectionWidth={42}
        leftSection={<Avatar src={user.profilePicture} alt="Profile Image" />}
      />
      <Collapse in={opened}>
        <TextInput
          value={text}
          onChange={(event) => setText(event.currentTarget.value)}
          radius="xl"
          size="md"
          mt={10}
          placeholder="Content"
          mb={10}
          rightSection={
            <ActionIcon size={32} radius="xl" variant="filled" type="submit">
              <IconArrowRight
                style={{ width: rem(18), height: rem(18) }}
                stroke={1.5}
              />
            </ActionIcon>
          }
        />
      </Collapse>
    </form>
  );
}

ExpandableForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  opened: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  setText: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  setTitle: PropTypes.func.isRequired,
};
