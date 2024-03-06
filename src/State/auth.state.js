import { atom } from "jotai";

let user = localStorage.getItem("user");
let token = localStorage.getItem("token");
let refreshToken = localStorage.getItem("refreshToken");
export let isLoggedInAtom;

if (user && token && refreshToken) {
  try {
    user = JSON.parse(user);
    isLoggedInAtom = atom(true);
  } catch (error) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    isLoggedInAtom = atom(false);
  }
} else {
  user = {};
  isLoggedInAtom = atom(false);
}

export const userAtom = atom(user, (_get, set, newUser) => {
  set(userAtom, newUser);
});
