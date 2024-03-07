import { Route, Routes } from "react-router-dom";
import { HomePage } from "./Pages/HomePage";
import { Profile } from "./Pages/Profile";
import { Header } from "./Components/Header";
import { AppShell } from "@mantine/core";
import { SideBar } from "./Components/Sidebar";
import { useDisclosure } from "@mantine/hooks";
import { isLoggedInAtom } from "./State/auth.state";
import { useAtom } from "jotai";
import { NotLoggedIn } from "./Components/NotLoggedIn";
import { ViewPost } from "./Pages/ViewPost";

function App() {
  const [opened, { toggle }] = useDisclosure();
  const [isLoggedIn] = useAtom(isLoggedInAtom);
  return (
    <>
      {isLoggedIn ? (
        <AppShell
          header={{ height: 60 }}
          navbar={{
            width: 300,
            breakpoint: "sm",
            collapsed: { mobile: !opened },
          }}
          padding="md"
        >
          <Header opened={opened} toggle={toggle} />
          <SideBar />
          <AppShell.Main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile/:contactId" element={<Profile />} />
              <Route path="/posts/:postId" element={<ViewPost />} />
            </Routes>
          </AppShell.Main>
        </AppShell>
      ) : (
        <NotLoggedIn />
      )}
    </>
  );
}

export default App;
