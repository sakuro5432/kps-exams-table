import { LucideClockFading } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { action } from "@/components/RequestUpdateButton/action";
import { toast } from "sonner";

interface Props {
  isRequestable: { disabled: boolean; message: string };
}

export function RequestUpdateButton({ isRequestable }: Props) {
  const [isDisabled, setIsDisabled] = useState(isRequestable.disabled);

  const handleClick = async () => {
    setIsDisabled(true);
    const res = await action();
    if (res.code !== "SUCCESS") {
      toast.error(res.message);
    } else {
      toast.success(res.message);
    }

    // ถ้าไม่สำเร็จจริง (เช่นยังไม่ถึงเวลา cooldown) ให้ enable ปุ่มคืนได้
    if (res.disabled === false) {
      setIsDisabled(false);
    }
  };

  return (
    <Button
      type="button"
      className="xl:w-fit w-1/2"
      variant={"outline"}
      onClick={handleClick}
      disabled={isDisabled}
    >
      <LucideClockFading className="mr-2" />
      อัปเดตข้อมูล{" "}
      {!isRequestable.message.startsWith("พร้อม") && (
        <span>({isRequestable.message})</span>
      )}
    </Button>
  );
}
