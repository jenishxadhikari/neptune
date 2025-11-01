"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LoaderCircle, Music } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { ErrorAlert } from "@/components/error-alert"
import { SubmitButton } from "@/components/submit-button"

import { editUserSchema, updateUserSchema } from "@/features/admin/users/schemas"
import { updateUser } from "@/features/admin/users/actions"

interface EditUserFormProps {
  data: z.infer<typeof updateUserSchema>
}

export function EditUserForm({ data }: EditUserFormProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof editUserSchema>>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: data.name,
      email: data.email,
      role: data.role
    },
  })

  const pending = form.formState.isSubmitting

  async function onSubmit(values: z.infer<typeof editUserSchema>) {
    console.log("hello");
    
    setError(null)
    try {
      const result = await updateUser({
        id: data.id,
        name: values.name,
        email: values.email,
        role: values.role
      })
      if (!result?.success) {
        setError(result.message)
      }
      if (result?.success) {
        toast.success(result.message)
        form.reset()
        router.push("/admin/users")
      }
      return
    } catch {
      setError("Something went wrong, please try again.")
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Header
        title="Edit Song"
        description="Edit the song in the system."
        icon={Music}
      >
        <Button onClick={() => router.back()} variant="outline">
          Back
        </Button>
      </Header>
      <Card>
        <CardContent>
          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the name"
                        disabled={pending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the email"
                        type="email"
                        disabled={pending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!!error && (
                <ErrorAlert message={error} />
              )}
              <SubmitButton pending={pending} label="Save Changes" />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
