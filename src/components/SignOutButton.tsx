"use client";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";

export default function SignOutButton() {
  const logOut = () => {
    const v = confirm("คุณต้องการออกจากระบบ?");
    if (v) {
      signOut();
    }
  };
  return <Button onClick={logOut}>ออกจากระบบ</Button>;
}
