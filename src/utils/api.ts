import { env } from "@/env";
import { Auth } from "@/lib/auth";
import axios from "axios";

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_MYKU_API_URL,
  headers: {
    "app-key": env.NEXT_PUBLIC_MYKU_APP_KEY,
  },
});

export const apiWithAuth = axios.create({
  baseURL: env.NEXT_PUBLIC_MYKU_API_URL,
  headers: { "app-key": env.NEXT_PUBLIC_MYKU_APP_KEY },
});

apiWithAuth.interceptors.request.use(async (req) => {
  const isAuth = await Auth();
  if (isAuth) {
    req.headers["x-access-token"] = isAuth.session.accesstoken;
  }
  return req;
});
