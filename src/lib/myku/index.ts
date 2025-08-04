import "server-only";
import crypto from "crypto";
import axios from "axios";
import {
  RenewTokenResponseInterface,
  SignInServicePropsInterface,
  SignInServiceResponseInterface,
} from "./types";
import { headers } from "./utils";
import { MyKuQueryInstance } from "./query";
import { envServer } from "@/env/server.mjs";

class MyKU {
  constructor() {}
  private encodeString = (str: string) => {
    return crypto
      .publicEncrypt(
        {
          key: envServer.MYKU_PUBLIC_KEY.replace(/\\n/gm, "\n"),
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        Buffer.from(str, "utf8")
      )
      .toString("base64");
  };
  login(props: SignInServicePropsInterface) {
    if (!props.username || !props.password)
      throw new Error("username & password is required!");
    return axios.post<SignInServiceResponseInterface>(
      "https://my.ku.th/myku/api/v2/user-login/login",
      {
        username: this.encodeString(props.username),
        password: this.encodeString(props.password),
      },
      { headers: headers() }
    );
  }
  renewToken(renewtoken: string) {
    return axios<RenewTokenResponseInterface>({
      method: "post",
      url: `https://myapi.ku.th/auth/renew`,
      headers: headers(renewtoken),
      data: {
        renewtoken: renewtoken,
      },
    });
  }
  async logout(loginName: string, accesstoken: string) {
    // loginName start with b
    return axios.post(
      "https://my.ku.th/myku/api/v2/user-login/logout",
      JSON.stringify({ loginName }),
      { headers: headers(accesstoken) }
    );
  }
  // query
  query(token: string) {
    return new MyKuQueryInstance(token);
  }
}

export const app = new MyKU();
