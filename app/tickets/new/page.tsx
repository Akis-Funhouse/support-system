import Link from "next/link";

import { db } from "@/db";
import { users, categories } from "@/db/schema";

import { createTicket } from "./actions"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
    searchParams: Promise<{ error?: string}>;
}) {

    const allUsers = await db.select().from(users);
    const allCategories = await db.select().from(categories);

    const { error } = await searchParams;

    return(
        <main className="min-h-screen bg-muted/40 px-4 py-10 sm:px-6">
  <div className="mx-auto max-w-2xl">

    {/* Tillbaka-länk */}
    <Button variant="ghost" className="mb-6 -ml-3">
      <Link href="/tickets">
        ← Back to tickets
      </Link>
    </Button>

    <Card className="border-0 shadow-md">

      {/* Rubrik */}
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Create New Ticket
        </CardTitle>

        <CardDescription>
          Fill in the information below to report a new support issue.
        </CardDescription>
      </CardHeader>

      <CardContent>

        {/* Felmeddelande */}
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
          >
            {error === "missing"
              ? "Please fill in all fields."
              : "Please select valid users and categories."}
          </div>
        )}

        <form action={createTicket} className="flex flex-col gap-6">

          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>

            <Input
              id="title"
              type="text"
              name="title"
              required
              placeholder="Enter ticket title"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>

            <Textarea
              id="description"
              name="description"
              required
              rows={5}
              placeholder="Describe the problem in detail..."
              className="resize-y"
            />
          </div>

          {/* User */}
          <div className="space-y-2">
            <label htmlFor="userId" className="text-sm font-medium">
              Reported by
            </label>

            <Select name="userId" required>
              <SelectTrigger id="userId" className="w-full">
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
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label htmlFor="categoryId" className="text-sm font-medium">
              Category
            </label>

            <Select name="categoryId" required>
              <SelectTrigger id="categoryId" className="w-full">
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
          </div>

          {/* Knappar */}
          <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">

            <Button variant="outline">
              <Link href="/tickets">
                Cancel
              </Link>
            </Button>

            <Button type="submit">
              Create Ticket
            </Button>

          </div>

        </form>
      </CardContent>
    </Card>

  </div>
</main>
    );
}