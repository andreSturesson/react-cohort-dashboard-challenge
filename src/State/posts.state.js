import { loadable, atomWithRefresh } from "jotai/utils";
import { getPosts } from "../Helpers/APIManager";

const fetchData = async () => {
  const data = await getPosts();
  console.log("data", data);
  return data;
};

export const postAtom = atomWithRefresh(async (get) => {
  return fetchData();
});

export const loadablePostAtom = loadable(postAtom);
