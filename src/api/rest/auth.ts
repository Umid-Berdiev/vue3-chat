import { setToken } from "../config.js";
import makeRequest from "../makeRequest.js";

export const signup = async (payload) => {
  try {
    const res = await makeRequest({
      url: "/api/signup",
      method: "post",
      data: payload,
    });

    return setToken(res.data.token);
  } catch (error) {
    throw error;
  }
};

export const login = async ({ email, password }) => {
  try {
    const res = await makeRequest({
      url: "http://localhost:8889/login",
      method: "post",
      data: {
        email,
        password,
      },
    });

    return setToken(res.data.token);
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  await makeRequest({
    url: "/api/logout",
    method: "post",
    headers: { authorization: true },
  });
  return setToken(null);
};

// export const checkAuth = function({ axios, redirect, $auth }) {
//   axios.onError(error => {
//     const code = parseInt(error.response && error.response.status);
//     if (code === 401) {
//       if ($auth && $auth.loggedIn) {
//         $auth.logout();
//       }
//       redirect('/');
//     }
//     throw error;
//   });
// }
