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
    return getErrorMessage(error);
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
    const temp = axios.create();
    const response = await temp.post(`${BASE_URL}/login`, credentials, {});
    const data = response.data;
    if (data.accessToken && data.refreshToken) {
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      const user = await getProfile();
      localStorage.setItem("user", JSON.stringify(user));
    }
    return response;
  } catch (error) {
    return getErrorMessage(error);
  }
}

export async function register(credentials) {
  try {
    const response = await axios.post(`${BASE_URL}/user/register`, credentials);
    const data = response.data;
    return data;
  } catch (error) {
    return getErrorMessage(error);
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
    return getErrorMessage(error);
  }
}

export async function getPostById(postId) {
  try {
    const response = await axios.get(`${BASE_URL}/posts/${postId}`);
    return response.data;
  } catch (error) {
    return getErrorMessage(error);
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
    return getErrorMessage(error);
  }
}

export async function likePost(postId) {
  try {
    const response = await axios.post(`${BASE_URL}/posts/${postId}/like`);
    return response.data;
  } catch (error) {
    return getErrorMessage(error);
  }
}

export async function unlikePost(postId) {
  try {
    const response = await axios.post(`${BASE_URL}/posts/${postId}/dislike`);
    return response.data;
  } catch (error) {
    return getErrorMessage(error);
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
    return getErrorMessage(error);
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
    const data = response.data;
    return data;
  } catch (error) {
    return getErrorMessage(error);
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
    return getErrorMessage(error);
  }
}

export async function getProfile() {
  try {
    const response = await axios.get(`${BASE_URL}/user`);
    return response.data;
  } catch (error) {
    return getErrorMessage(error);
  }
}

function getErrorMessage(error) {
  const statusCode = error.response.status;
  switch (statusCode) {
    case 401:
      if (localStorage.getItem("refreshToken")) {
        console.error("Refresh token failed:", error);
        return {
          status: "UNAUTHORIZED_REFRESH_FAILED",
          message: "Unable to refresh your access token. Please log in again.",
        };
      } else {
        console.error("Missing refresh token");
        return {
          status: "UNAUTHORIZED_EXPIRED",
          message: "Invalid username or password.",
        };
      }
    case 400:
      return {
        status: "BAD_REQUEST",
        message: "Invalid request. Please check your input and try again.",
      };
    case 404:
      return {
        status: "NOT_FOUND",
        message: "The requested resource was not found.",
      };
    case 500:
      return {
        status: "INTERNAL_SERVER_ERROR",
        message: "Internal server error. Please try again later.",
      };
    default:
      return {
        status: "UNKNOWN_ERROR",
        message: "An error occurred. Please try again later.",
      };
  }
}
