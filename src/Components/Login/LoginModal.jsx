import {
  Button,
  TextInput,
  Text,
  PasswordInput,
  Divider,
  Paper,
  Group,
  Anchor,
  Checkbox,
  Stack,
  Center,
  Badge,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { userAtom, isLoggedInAtom } from "../../State/auth.state";
import { useAtom } from "jotai";
import { login, register } from "../../Helpers/APIManager";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useToggle } from "@mantine/hooks";
import { useState } from "react";

export function LoginModal({ close }) {
  const [type, toggle] = useToggle(["login", "register"]);
  const [user, setUser] = useAtom(userAtom);
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      profilePicture: "",
      email: "",
      password: "",
      terms: true,
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(
          value
        )
          ? null
          : "Password should have 8 characters, 1 capital letter, 1 special character, and 1 numeral",
    },
    validateInputOnChange: true,
  });

  async function handleRegister() {
    console.log("Registering...");
    try {
      const submit = {
        email: form.values.email,
        password: form.values.password,
        firstName: form.values.firstName,
        lastName: form.values.lastName,
        profilePicture: form.values.profilePicture,
      };

      const response = await register(submit);
      if (response.status === 200) {
        await login({
          email: form.values.email,
          password: form.values.password,
        });
        const registeredUser = JSON.parse(localStorage.getItem("user"));
        setUser(registeredUser);
        setIsLoggedIn(true);
        close();
        navigate(`/profile/${registeredUser.id}`);
      } else {
        const { message } = response;
        setError(message);
        return;
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  }

  async function handleLogin() {
    try {
      const response = await login(form.values);
      console.log("Response:", response);
      if (response.status === 200) {
        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        setUser(loggedInUser);
        setIsLoggedIn(true);
        close();
        navigate(`/profile/${loggedInUser.id}`);
      } else {
        const { message } = response;
        setError(message);
        return;
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  }

  async function handleSubmit() {
    form.validate();
    if (type === "register") {
      console.log("Registering...");
      await handleRegister();
    }
    if (type === "login") {
      console.log("Logging in...");
      await handleLogin();
    }
    return;
  }

  return (
    <Paper radius="md" p="xl">
      <Center>
        <Text size="lg" fw={500}>
          Welcome to Cohort Manager
        </Text>
      </Center>

      <Divider
        label="Please supply your information."
        labelPosition="center"
        my="lg"
      />

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {type === "register" && (
            <>
              <TextInput
                required
                label="First Name"
                placeholder="Your first name"
                {...form.getInputProps("firstName")}
                radius="md"
              />
              <TextInput
                required
                label="Last Name"
                placeholder="Your last name"
                {...form.getInputProps("lastName")}
                radius="md"
              />
              <TextInput
                required
                label="Profile Picture"
                placeholder="URL to a profile picture"
                {...form.getInputProps("profilePicture")}
                radius="md"
              />
            </>
          )}

          <TextInput
            required
            label="Email"
            placeholder="example@domain.com"
            {...form.getInputProps("email")}
            error={form.errors.email && "Invalid email"}
            radius="md"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            {...form.getInputProps("password")}
            error={
              form.errors.password &&
              "Password should have 8 characters, 1 capital letter, 1 special character, and 1 numeral"
            }
            radius="md"
          />

          {type === "register" && (
            <Checkbox
              label="I accept terms and conditions"
              checked={form.values.terms}
              onChange={(event) =>
                form.setFieldValue("terms", event.currentTarget.checked)
              }
            />
          )}
        </Stack>

        {error && (
          <Center mt={15}>
            <Badge color="red">{error}</Badge>
          </Center>
        )}
        <Group justify="space-between" mt="xl">
          <Anchor
            component="button"
            type="button"
            c="dimmed"
            onClick={() => toggle()}
            size="xs"
          >
            {type === "register"
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </Anchor>
          <Button type="submit" disabled={form.isSubmitting || form.hasErrors}>
            {type}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}

LoginModal.propTypes = {
  close: PropTypes.func.isRequired,
};
