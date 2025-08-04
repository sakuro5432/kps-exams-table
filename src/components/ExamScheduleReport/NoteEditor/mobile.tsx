"use client";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../../ui/button";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { useEffect } from "react";
import { Props } from "./types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

export function Mobile({
  data,
  form,
  onSubmit,
  isDisabled,
  setOpen,
  open,
  isSubmit,
}: Props) {
  useEffect(() => {
    if (!open) {
      form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size={"icon"} variant={"outline"} className="export-hidden">
          <Pencil2Icon />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{data.subjectNameTh}</DrawerTitle>
          <DrawerDescription>รหัสวิชา : {data.subjectCode}</DrawerDescription>
        </DrawerHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name={"note"}
                render={({ field }) => (
                  <FormItem className="px-4">
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <Textarea {...field} disabled={isSubmit} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DrawerFooter>
                <Button disabled={isDisabled || isSubmit}>บันทึก</Button>
                <DrawerClose asChild>
                  <Button variant="outline" disabled={isSubmit}>
                    ยกเลิก
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
