import "server-only";
import crypto from "crypto";
import {
  SignInServicePropsInterface,
  SignInServiceResponseInterface,
} from "./types";
import { headers } from "./utils";
import { MyKuQueryInstance } from "./query";
import { api } from "@/utils/api";
import { env } from "@/env";

class MyKU {
  constructor() {}
  private encodeString = (str: string) => {
    return crypto
      .publicEncrypt(
        {
          key: env.MYKU_PUBLIC_KEY.replace(/\\n/gm, "\n"),
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        Buffer.from(str, "utf8")
      )
      .toString("base64");
  };
  login(props: SignInServicePropsInterface) {
    if (!props.username || !props.password)
      throw new Error("username & password is required!");
    return api.post<SignInServiceResponseInterface>(
      "/v2/user-login/login",
      {
        username: this.encodeString(props.username),
        password: this.encodeString(props.password),
      },
      { headers: headers() }
    );
  }
  async logout(loginName: string, accesstoken: string) {
    if (!accesstoken) throw new Error("accesstoken is required!");
    // loginName start with b
    return api.post("/v2/user-login/logout", JSON.stringify({ loginName }), {
      headers: {
        "x-access-token": accesstoken,
      },
    });
  }
  // query
  query(stdId: string) {
    return new MyKuQueryInstance(stdId);
  }
}

export const app = new MyKU();
// app.query(stdId).
