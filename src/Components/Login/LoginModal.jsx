import { Button, Container, Space, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { userAtom, isLoggedInAtom } from "../../State/auth.state";
import { useAtom } from "jotai";
import { login } from "../../Helpers/APIManager";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export function LoginModal({ close }) {
  const [user, setUser] = useAtom(userAtom);
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);

  const navigate = useNavigate();

  const form = useForm({
    initialValues: { email: "", password: "" }, // Include password in initial values
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length >= 6 ? null : "Password should be at least 6 characters", // Adjust validation for min length
    },
    validateInputOnChange: true,
  });

  async function handleLogin() {
    form.validate();

    try {
      const response = await login(form.values);
      console.log(response);
      switch (response.status) {
        case 401:
          console.error("Invalid credentials");
          break;
        case 500:
          console.error("Server error");
          break;
        case 200:
          try {
            console.log("Sucess");
          } catch (error) {
            console.error("Error parsing user data from localStorage:", error);
          }
          const loggedInUser = JSON.parse(localStorage.getItem("user"));
          setUser(loggedInUser);
          setIsLoggedIn(true);
          close();
          navigate(`/profile/${loggedInUser.id}`);
          break;
        default:
          console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  }

  return (
    <Container>
      <form onSubmit={form.onSubmit(handleLogin)}>
        <TextInput
          mt="sm"
          label="Email"
          placeholder="Email"
          {...form.getInputProps("email")}
        />
        <TextInput
          mt="sm"
          label="Password"
          placeholder="Password"
          {...form.getInputProps("password")}
        />
        <Space h={16} />
        <Space h={16} />
        <Button type="submit" disabled={form.isSubmitting || form.hasErrors}>
          Login
        </Button>
      </form>
    </Container>
  );
}

LoginModal.propTypes = {
  close: PropTypes.func.isRequired,
};
