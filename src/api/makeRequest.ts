import axios from "axios";
import * as config from "./config";

export default async ({
  url = "/",
  method = "get",
  headers = {},
  params = {},
  data = {},
}) => {
  if (headers && headers.authorization) {
    headers.token = config.getToken();
  }

  try {
    return await axios({
      url,
      method,
      headers,
      params,
      data,
    });
  } catch (error) {
    config.errorHandler(error, { url, method, headers, params, data });
    throw error;
  }
};
