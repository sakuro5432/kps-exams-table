"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

export function Logout() {
  const [open, setOpen] = useState(false);
  // const [countdown, setCountdown] = useState(10);
  // const deadlineRef = useRef<number | null>(null);
  const { data } = useSession();

  useEffect(() => {
    if (data && data.user.forceLogout) {
      setOpen(true);
      // deadlineRef.current = Date.now() + 10000; // 10 วิ
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.user.forceLogout]);

  // useEffect(() => {
  //     if (!open || !deadlineRef.current) return;

  //     const tick = () => {
  //         const remain = Math.max(
  //             0,
  //             Math.ceil((deadlineRef.current! - Date.now()) / 1000)
  //         );
  //         setCountdown(remain);

  //         if (remain <= 0) {
  //             signOut({ callbackUrl: "/", redirect: true });
  //         }
  //     };

  //     tick(); // run ครั้งแรกทันที
  //     const timer = setInterval(tick, 1000);

  //     return () => clearInterval(timer);
  // }, [open]);

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>คุณจำเป็นต้องออกจากระบบ</DialogTitle>
          <DialogDescription>
            มีการเข้าสู่ระบบที่อุปกรณ์อื่น / เซสชั่นหมดอายุ
          </DialogDescription>
        </DialogHeader>
        <div className="text-sm">
          1 บัญชีใช้งานได้ 1 เครื่อง. <br />
          หากมีการเข้าสู่ระบบจากอุปกรณ์อื่น
          อุปกรณ์ก่อนหน้าจะถูกบังคับออกจากระบบ.
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={() => signOut({ callbackUrl: "/", redirect: true })}
          >
            รับทราบและออกจากระบบ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
