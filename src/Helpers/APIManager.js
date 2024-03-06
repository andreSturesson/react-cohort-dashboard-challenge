import axios from "axios";
const BASE_URL = "http://localhost:5223";

/**
 * Interceptor for handling response errors.
 * @param {Object} response - The response object.
 * @returns {Object} - The response object.
 * @throws {Error} - If the request is aborted or there is a refresh token error.
 */
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("Request aborted:", error);
      throw new Error("Request Aborted");
    }
    if (error.response && error.response.status === 401) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const response = await axios.post(`${BASE_URL}/refresh`, {
            refreshToken,
          });
          const data = response.data;
          localStorage.setItem("token", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);

          // Make request again...
          const originalRequest = error.config;
          originalRequest.headers.Authorization = `Bearer ${data.token}`;
          return axios(originalRequest);
        } catch (error) {
          console.error("Refresh token error:", error);
          throw new Error("Refresh Token Error");
        }
      } else {
        console.error("Missing refresh token");
        throw new Error("Missing Refresh Token");
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Interceptor for adding authorization headers to requests.
 * @param {Object} config - The request config object.
 * @returns {Object} - The modified request config object.
 * @throws {Error} - If there is an error in the request.
 */
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (refreshToken) {
      config.headers.RefreshToken = refreshToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Logs in the user with the provided credentials.
 * @param {Object} credentials - The user credentials.
 * @param {string} credentials.email - The user's email.
 * @param {string} credentials.password - The user's password.
 * @returns {Object} - The login response data.
 * @throws {Error} - If there is an error during login.
 */
export async function login(credentials) {
  try {
    const response = await axios.post(`${BASE_URL}/login`, credentials);
    const data = response.data;
    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    const user = await getProfile();
    console.log("user", user);
    localStorage.setItem("user", JSON.stringify(user));
    return response;
  } catch (error) {
    handleError(error);
  }
}

export async function register(credentials) {
  try {
    const response = await axios.post(`${BASE_URL}/register`, credentials);
    const data = response.data;
    localStorage.setItem("token", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);
    return data;
  } catch (error) {
    handleError(error);
  }
}

/**
 * Retrieves the posts.
 * @returns {Array} - The array of posts.
 * @throws {Error} - If there is an error retrieving the posts.
 */
export async function getPosts() {
  try {
    const response = await axios.get(`${BASE_URL}/posts`);
    const posts = response.data;
    posts.reverse();
    return posts;
  } catch (error) {
    handleError(error);
  }
}

/**
 * Creates a new post.
 * @param {Object} post - The post object.
 * @param {string} post.title - The post title.
 * @param {string} post.text - The post text.
 * @returns {Object} - The created post data.
 * @throws {Error} - If there is an error creating the post.
 */
export async function createPost(post) {
  try {
    const response = await axios.post(`${BASE_URL}/posts`, post, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

/**
 * Retrieves the comments for a post.
 * @param {string} postId - The ID of the post.
 * @returns {Array} - The array of comments for the post.
 * @throws {Error} - If there is an error retrieving the comments.
 */
export async function getComments(postId) {
  try {
    const response = await axios.get(`${BASE_URL}/posts/${postId}/comments`);
    const data = response.data;
    return data.reverse();
  } catch (error) {
    handleError(error);
  }
}

/**
 * Creates a new comment for a post.
 * @param {Object} comment - The comment object.
 * @param {string} comment.text - The comment text.
 * @param {string} postId - The ID of the post.
 * @returns {Array} - The array of comments with contact information.
 * @throws {Error} - If there is an error creating the comment.
 */
export async function createComment(comment, postId) {
  try {
    const response = await axios.post(
      `${BASE_URL}/comments/${postId}/`,
      comment,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response);
    const data = response.data;
    return data;
  } catch (error) {
    handleError(error);
  }
}

/**
 * Retrieves a contact by ID.
 * @param {string} id - The ID of the contact.
 * @returns {Object} - The contact data.
 * @throws {Error} - If there is an error retrieving the contact.
 */
export async function getUserById(id) {
  try {
    const response = await axios.get(`${BASE_URL}/user/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

export async function getProfile() {
  try {
    const response = await axios.get(`${BASE_URL}/user`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}

/**
 * Handles the error by logging it and throwing it.
 * @param {Error} error - The error object.
 * @throws {Error} - The error object.
 */
const handleError = (error) => {
  console.error(error);
  throw error;
};
