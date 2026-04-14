import { useState } from "react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Trans } from "@lingui/react/macro"
import { useLingui } from "@lingui/react/macro"
import { useAuth } from "@clerk/react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { api } from "@/lib/api"
import type {
  Project,
  ProjectCategory,
  SubmitProjectRequest,
} from "@shared/types"
import { PROJECT_CATEGORIES } from "@shared/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const Route = createFileRoute("/submit")({
  component: SubmitPage,
})

function SubmitPage() {
  const { t } = useLingui()
  const { isSignedIn, isLoaded } = useAuth()
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<ProjectCategory | "">("")

  const submitMutation = useMutation({
    mutationFn: (data: SubmitProjectRequest) =>
      api.post<Project>("/api/projects", data),
    onSuccess: () => {
      toast.success(t`Your idea has been submitted for review!`)
      setTitle("")
      setDescription("")
      setCategory("")
    },
    onError: (error: Error) => {
      toast.error(error.message || t`Failed to submit project`)
    },
  })

  if (!isLoaded) {
    return null
  }

  if (!isSignedIn) {
    void navigate({ to: "/" })
    return null
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim() || !description.trim() || !category) {
      toast.error(t`Please fill in all fields`)
      return
    }

    submitMutation.mutate({
      title: title.trim(),
      description: description.trim(),
      category: category as ProjectCategory,
    })
  }

  const CATEGORY_LABELS: Record<ProjectCategory, string> = {
    education: "Education",
    environment: "Environment",
    health: "Health",
    infrastructure: "Infrastructure",
    community: "Community",
    other: "Other",
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-foreground">
            <Trans>Submit a Volunteering Idea</Trans>
          </CardTitle>
          <CardDescription>
            <Trans>Describe your project idea and it will be reviewed by an admin
            before going live.</Trans>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="title"
                className="text-sm font-medium text-foreground/90"
              >
                <Trans>Title</Trans>
              </label>
              <Input
                id="title"
                placeholder={t`Give your idea a clear, descriptive title`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={submitMutation.isPending}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-foreground/90"
              >
                <Trans>Description</Trans>
              </label>
              <Textarea
                id="description"
                placeholder={t`Explain what the project involves, who it helps, and what volunteers would do`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={submitMutation.isPending}
                rows={5}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground/90">
                <Trans>Category</Trans>
              </label>
              <Select
                value={category}
                onValueChange={(val) => setCategory(val as ProjectCategory)}
                disabled={submitMutation.isPending}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t`Select a category`} />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {CATEGORY_LABELS[cat]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={submitMutation.isPending}
              className="self-start"
            >
              {submitMutation.isPending ? <Trans>Submitting...</Trans> : <Trans>Submit Idea</Trans>}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
