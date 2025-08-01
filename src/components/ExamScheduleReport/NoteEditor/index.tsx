"use client";

import { useDesktop } from "@/components/useDesktop";
import { Desktop } from "./desktop";
import { Mobile } from "./mobile";
import { Props } from "./types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schema } from "./schema.z";
import {
  startTransition,
  useActionState,
  useEffect,
  useMemo,
  useState,
} from "react";
import { update } from "./update";
import { toast } from "sonner";

export default function NoteEditor({
  data,
}: Omit<
  Props,
  "form" | "onSubmit" | "isDisabled" | "isSubmit" | "setOpen" | "open"
>) {
  const [open, setOpen] = useState(false);
  const defaultValues = useMemo<{
    userExamId: string;
    note: string;
  }>(
    () => ({
      userExamId: data.id,
      note: data.note || "",
    }),
    [data.note]
  );
  // const query = useQuery({
  //   queryKey: [`note${data.id}`],
  //   queryFn: () => getNote(data.id),
  //   enabled: open,
  // });
  const isDesktop = useDesktop();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { watch } = form;
  const currentValues = watch();

  // เปรียบเทียบค่าปัจจุบันกับค่า default
  const isDisabled = currentValues.note?.trim() === defaultValues.note;

  const [formState, dispatch, isSubmit] = useActionState(update, null);
  const onSubmit: Props["onSubmit"] = (value) => {
    const formData = new FormData();
    formData.append("userExamId", value.userExamId);
    formData.append("note", value.note ?? "");
    startTransition(() => dispatch(formData));
  };

  useEffect(() => {
    if (formState !== null) {
      if (formState.code === "SUCCESS") {
        toast.success(formState.message);
        // รีเซ็ต form ด้วยค่าปัจจุบัน (note ที่เพิ่งอัปเดต)
        form.reset({ userExamId: data.id, note: data.note || "" });
      } else {
        toast.error(formState.message, { description: "โปรดลองใหม่อีกครั้ง" });
      }
    }
    setOpen(false);
  }, [formState]);

  // useEffect(() => {
  //   if (!query.isLoading && query.data !== null) {
  //     const comment = query.data?.note ?? "";

  //     setDefaultValues((prev) => ({
  //       ...prev,
  //       note: comment,
  //     }));

  //     // สำคัญ: อัปเดตค่าใน react-hook-form ด้วย
  //     form.reset({
  //       userExamId: data.id,
  //       note: comment,
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [query.isLoading, query.data]);

  // if (query.isLoading || query.isFetching) {
  //   return (
  //     <Button variant={"outline"} size={"icon"}>
  //       ...
  //     </Button>
  //   );
  // }

  // if (query.isError) {
  //   // query.error อาจเป็น unknown type ต้อง cast
  //   const message =
  //     query.error instanceof Error ? query.error.message : "เกิดข้อผิดพลาด";
  //   return <div>{message}</div>;
  // }
  if (isDesktop)
    return (
      <Desktop
        data={data}
        form={form}
        onSubmit={onSubmit}
        isDisabled={isDisabled}
        isSubmit={isSubmit}
        setOpen={setOpen}
        open={open}
      />
    );
  return (
    <Mobile
      data={data}
      form={form}
      onSubmit={onSubmit}
      isDisabled={isDisabled}
      isSubmit={isSubmit}
      setOpen={setOpen}
      open={open}
    />
  );
}
