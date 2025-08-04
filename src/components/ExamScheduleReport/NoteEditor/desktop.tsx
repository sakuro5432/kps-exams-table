"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

export function Desktop({
  data,
  form,
  onSubmit,
  isDisabled,
  setOpen,
  open,
  isSubmit,
}: Props) {
  const onOpenChange = () => setOpen(!open);
  useEffect(() => {
    if (!open) {
      form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size={"icon"} variant={"outline"} className="export-hidden">
          <Pencil2Icon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>วิชา : {data.subjectNameTh}</DialogTitle>
          <DialogDescription>รหัสวิชา : {data.subjectCode}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name={"note"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Textarea {...field} disabled={isSubmit} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"outline"} disabled={isSubmit}>
                  ยกเลิก
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isDisabled || isSubmit}>
                บันทึก
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
