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
        value.length >= 6 ? null : "Password should be at least 6 characters",
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
      switch (response.status) {
        case 400:
          console.log("Invalid user data");
          setError(response.data[0]);
          break;
        case 500:
          console.log("Server error");
          break;
        case 200:
          console.log("User registered");
          await login({
            email: form.values.email,
            password: form.values.password,
          });
          const registeredUser = JSON.parse(localStorage.getItem("user"));
          setUser(registeredUser);
          setIsLoggedIn(true);
          close();
          navigate(`/profile/${registeredUser.id}`);
          break;
        default:
          console.log("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  }
  async function handleLogin() {
    console.log(form.values);
    try {
      const response = await login(form.values);
      switch (response.status) {
        case 401:
          console.log("Invalid credentials");
          break;
        case 500:
          console.log("Server error");
          break;
        case 200:
          try {
            console.log("Success");
          } catch (error) {
            console.log("Error parsing user data from localStorage:", error);
          }
          const loggedInUser = JSON.parse(localStorage.getItem("user"));
          setUser(loggedInUser);
          setIsLoggedIn(true);
          close();
          navigate(`/profile/${loggedInUser.id}`);
          break;
        default:
          console.log("Unexpected response status:", response.status);
          return;
      }
    } catch (error) {
      console.log("Error during login:", error);
      return;
    }
  }

  async function handleSubmit() {
    console.log("form submitted");
    console.log("form errors:", form.errors);
    console.log("form values:", form.values);
    console.log("type:", type);
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
                label="First Name"
                placeholder="Your first name"
                {...form.getInputProps("firstName")}
                radius="md"
              />
              <TextInput
                label="Last Name"
                placeholder="Your last name"
                {...form.getInputProps("lastName")}
                radius="md"
              />
              <TextInput
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
              "Password should include at least 6 characters"
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

        <Divider label={error} labelPosition="center" my="lg" />

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
