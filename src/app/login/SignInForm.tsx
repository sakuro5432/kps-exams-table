"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signInSchema, z } from "@/zod/auth";

let signIn: typeof import("next-auth/react").signIn;

async function loadSignInButton() {
  if (!signIn) {
    const mod = await import("next-auth/react");
    signIn = mod.signIn;
  }
  return signIn;
}

export function SignInForm() {
  const router = useRouter();
  const [isSubmit, setSubmit] = useState(false);
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: { username: "", password: "" },
  });
  const onSubmit = async (value: z.infer<typeof signInSchema>) => {
    setSubmit(true);
    await loadSignInButton();
    const s = await signIn("credentials", {
      ...value,
      redirect: false,
      callbackUrl: "/exams",
    });
    if (s) {
      if (s.ok) {
        toast.success("เข้าสู่ระบบสำเร็จ");
        router.push("/exams");
        router.refresh();
      } else {
        if (s.error) {
          toast.error(s.error);
        } else {
          toast.error("เกิดข้อผิดพลาดไม่ทราบสาเหตุ (Login)", {
            description: "โปรดแจ้งเรา",
          });
        }
      }
    }
    setTimeout(() => setSubmit(false), 1000);
  };
  return (
    <Card className="xl:w-96 xl:max-w-96 h-fit mx-auto">
      <CardHeader>
        <CardTitle>เข้าสู่ระบบ</CardTitle>
        <CardDescription>กรอกรหัสผ่านเดียวกับ my.ku</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-1.5">
              <FormField
                disabled={isSubmit}
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block">
                      รหัสนิสิต
                      <FormMessage className="text-xs" />
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="bXXXXXXXXXX" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                disabled={isSubmit}
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block">
                      รหัสผ่าน
                      <FormMessage className="text-xs" />
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="กรอกรหัสผ่านที่นี่"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmit}>
              เข้าสู่ระบบ
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-xs text-destructive">
        * ทางเว็บไซต์ไม่เก็บข้อมูลรหัสผ่านของท่าน
        <br />
        * เว็บไซต์นี้ไม่ใช่ของวิทยาเขต
        <br />* จัดทำขึ้นเพื่ออำนวยความสะดวกแก่นิสิตด้วยกัน
      </CardFooter>
    </Card>
  );
}
