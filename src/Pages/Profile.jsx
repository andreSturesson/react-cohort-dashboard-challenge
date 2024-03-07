import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProfile } from "../Helpers/APIManager";
import {
  Card,
  Text,
  Table,
  Button,
  Space,
  Avatar,
  Center,
  Container,
} from "@mantine/core";
import { isLoggedInAtom, userAtom } from "../State/auth.state";
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";

export function Profile() {
  const [isLoggedIn, setLoggedIn] = useAtom(isLoggedInAtom);
  const [user, setUser] = useAtom(userAtom);
  const { contactId } = useParams();
  const [contact, setContact] = useState({});
  const navigate = useNavigate();

  const linkProps = {
    href: "https://mantine.dev",
    target: "_blank",
    rel: "noopener noreferrer",
  };

  useEffect(() => {
    getProfile(contactId).then((data) => {
      setContact(data);
    });
  }, [contactId]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("token");
    setLoggedIn(false);
    setUser({});
    navigate("/");
  };

  return (
    <Container size="lg">
      <Card withBorder radius="md" p={30}>
        <Card.Section>
          <a {...linkProps}>
            <Center>
              <Avatar src={contact.profilePicture} h={250} w={250} />
            </Center>
          </a>
        </Card.Section>

        <Text fw={500} component="a" {...linkProps} ta={"Center"} p={20}>
          {contact.firstName} {contact.lastName}
        </Text>

        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Street</Table.Th>
              <Table.Th>City</Table.Th>
              <Table.Th>Gender</Table.Th>
              <Table.Th>Longitude</Table.Th>
              <Table.Th>Latitude</Table.Th>
              <Table.Th>Email</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr style={{ textAlign: "left" }}>
              <Table.Td>{contact.street}</Table.Td>
              <Table.Td>{contact.city}</Table.Td>
              <Table.Td>{contact.gender}</Table.Td>
              <Table.Td>{contact.longitude}</Table.Td>
              <Table.Td>{contact.latitude}</Table.Td>
              <Table.Td>{contact.email}</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
        {isLoggedIn && user.id.toString() === contactId.toString() && (
          <>
            <Space h={10} />
            <Button variant="default" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
      </Card>
    </Container>
  );
}
