"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { taskSchema, type TaskFormData } from "@/schemas/task-schema";
import { TaskPriority, TaskStatus } from "@/lib/enums/tasks";
import { TaskFormProps } from "@/types/tasks";

const TaskForm = ({
  formId,
  defaultValues,
  onSubmit,
}: TaskFormProps) => {
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      status: defaultValues?.status ?? TaskStatus.TODO,
      priority: defaultValues?.priority ?? TaskPriority.LOW,
      dueDate: defaultValues?.dueDate,
    },
  });

  const [openCalendar, setOpenCalendar] = useState(false);

  return (
    <form
      id={formId}
      className="space-y-5"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Controller
        name="title"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor="task-title">Title</FieldLabel>
            <Input
              {...field}
              id="task-title"
              placeholder="Enter task title"
              maxLength={100}
            />
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />
      <Controller
        name="description"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor="task-description">
              Description
            </FieldLabel>
            <Textarea
              {...field}
              id="task-description"
              placeholder="Add a description"
              maxLength={500}
            />
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />
      <Controller
        name="status"
        control={form.control}
        render={({ field }) => (
          <Field>
            <FieldLabel>Status</FieldLabel>
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TaskStatus.TODO}>
                  {TaskStatus.TODO}
                </SelectItem>
                <SelectItem value={TaskStatus.IN_PROGRESS}>
                  {TaskStatus.IN_PROGRESS}
                </SelectItem>
                <SelectItem value={TaskStatus.DONE}>
                  {TaskStatus.DONE}
                </SelectItem>
              </SelectContent>
            </Select>
          </Field>
        )}
      />
      <Controller
        name="priority"
        control={form.control}
        render={({ field }) => (
          <Field>
            <FieldLabel>Priority</FieldLabel>
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TaskPriority.LOW}>
                  {TaskPriority.LOW}
                </SelectItem>
                <SelectItem value={TaskPriority.MEDIUM}>
                  {TaskPriority.MEDIUM}
                </SelectItem>
                <SelectItem value={TaskPriority.HIGH}>
                  {TaskPriority.HIGH}
                </SelectItem>
              </SelectContent>
            </Select>
          </Field>
        )}
      />
      <Controller
        name="dueDate"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Due date</FieldLabel>
            <Popover
              open={openCalendar}
              onOpenChange={setOpenCalendar}
            >
              <PopoverTrigger>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon />
                  {field.value
                    ? field.value.toLocaleDateString()
                    : "Select a due date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => {
                    field.onChange(date);
                    setOpenCalendar(false);
                  }}
                  disabled={{ before: new Date() }}
                />
              </PopoverContent>
            </Popover>
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />
    </form>
  );
};

export default TaskForm;
