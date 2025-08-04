import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { HTMLInputTypeAttribute } from "react";
import { Control, Path } from "react-hook-form";
import { Schema } from "zod";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";
interface Props<T, K> {
  label: string;
  placeholder?: string;
  name: Path<T>;
  control: Control<T | any>;
  schema?: Schema<T>;
  type?: HTMLInputTypeAttribute;
  textArea?: boolean;
  className?: string;
  disabled?: boolean;
}

export default function FormInput<T, K extends keyof T>({
  label,
  control,
  placeholder,
  name,
  schema,
  type = "text",
  textArea = false,
  className,
  disabled,
}: Props<T, K>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("w-full", className)}>
          <FormLabel className="block">
            {label}
            <FormMessage className="text-xs" />
          </FormLabel>
          <FormControl>
            {textArea ? (
              <Textarea
                placeholder={placeholder?.trim()}
                {...field}
                value={field.value ?? ""}
                className={"max-h-32"}
                disabled={disabled}
              />
            ) : (
              <Input
                placeholder={placeholder?.trim()}
                {...field}
                value={field.value ?? ""}
                type={type}
                disabled={disabled}
              />
            )}
          </FormControl>
        </FormItem>
      )}
    />
  );
}
