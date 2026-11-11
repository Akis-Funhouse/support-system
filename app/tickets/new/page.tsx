
import Link from "next/link";

import { db } from "@/db";
import { users, categories } from "@/db/schema";

import { createTicket } from "./actions";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const instant = false;

export default async function NewTicketPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const allUsers = await db.select().from(users);
  const allCategories = await db.select().from(categories);

  const { error } = await searchParams;

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">

        {/* Tillbaka */}
        <div className="mb-6">
          <Button variant="ghost" className="-ml-3">
            <Link href="/tickets">
              ← Back to tickets
            </Link>
          </Button>
        </div>

        {/* Sidhuvud */}
        <div className="mb-8">
          <Badge variant="secondary" className="mb-3">
            IT Department
          </Badge>

          <h1 className="text-3xl font-bold tracking-tight">
            Create New Ticket
          </h1>

          <p className="mt-2 text-muted-foreground">
            Report a technical issue to the IT support team.
            Fill in the details below to create a new ticket.
          </p>
        </div>

        {/* Formulär */}
        <Card className="border-0 shadow-md">

          <CardHeader className="border-b pb-6">
            <CardTitle className="text-xl">
              Ticket Information
            </CardTitle>

            <CardDescription>
              Provide as much information as possible so
              the support team can help you.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">

            {/* Felmeddelande */}
            {error && (
              <div
                role="alert"
                className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
              >
                <p className="font-semibold">
                  Unable to create ticket
                </p>

                <p className="mt-1">
                  {error === "missing"
                    ? "Please fill in all fields."
                    : "Please select valid users and categories."}
                </p>
              </div>
            )}

            <form action={createTicket} className="space-y-7">

              {/* Title */}
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="text-sm font-semibold"
                >
                  Ticket Title
                </label>

                <Input
                  id="title"
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Cannot connect to Wi-Fi"
                  className="h-11 bg-background"
                />

                <p className="text-xs text-muted-foreground">
                  Give your issue a short and descriptive title.
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="text-sm font-semibold"
                >
                  Description
                </label>

                <Textarea
                  id="description"
                  name="description"
                  required
                  rows={6}
                  placeholder="Describe the problem, what happened and when it started..."
                  className="min-h-36 resize-y bg-background"
                />

                <p className="text-xs text-muted-foreground">
                  Include any relevant details that could help
                  identify and resolve the issue.
                </p>
              </div>

              {/* Separering */}
              <div className="border-t" />

              {/* User */}
              <div className="space-y-2">
                <label
                  htmlFor="userId"
                  className="text-sm font-semibold"
                >
                  Reported By
                </label>

                <Select name="userId" required>
                  <SelectTrigger
                    id="userId"
                    className="h-11 w-full bg-background"
                  >
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>

                  <SelectContent>
                    {allUsers.map((user) => (
                      <SelectItem
                        key={user.id}
                        value={String(user.id)}
                      >
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <p className="text-xs text-muted-foreground">
                  Select the user reporting this issue.
                </p>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label
                  htmlFor="categoryId"
                  className="text-sm font-semibold"
                >
                  Category
                </label>

                <Select name="categoryId" required>
                  <SelectTrigger
                    id="categoryId"
                    className="h-11 w-full bg-background"
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>

                  <SelectContent>
                    {allCategories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={String(category.id)}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <p className="text-xs text-muted-foreground">
                  Choose the category that best describes the issue.
                </p>
              </div>

              {/* Knappar */}
              <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">

                <Button
                  variant="outline"
                  className="sm:min-w-28"
                >
                  <Link href="/tickets">
                    Cancel
                  </Link>
                </Button>

                <Button
                  type="submit"
                  className="sm:min-w-40"
                >
                  Create Ticket
                </Button>

              </div>

            </form>
          </CardContent>
        </Card>

        {/* Information längst ner */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Need help? Contact your IT support team.
        </p>

      </div>
    </main>
  );
}
