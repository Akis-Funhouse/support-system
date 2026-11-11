import { db } from "@/db";
import { tickets, users, categories, comments } from "@/db/schema";
import { updateTicketStatus, createComment } from "./actions";

import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export const instant = false;

export default async function TicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticketId = Number(id);

  if (!Number.isSafeInteger(ticketId) || ticketId < 1) {
    notFound();
  }

  const allComments = await db
    .select()
    .from(comments)
    .where(eq(comments.ticketId, ticketId))
    .orderBy(asc(comments.createdAt));

  const result = await db
    .select({
      id: tickets.id,
      title: tickets.title,
      description: tickets.description,
      status: tickets.status,
      createdAt: tickets.createdAt,
      userName: users.name,
      userEmail: users.email,
      categoryName: categories.name,
    })
    .from(tickets)
    .innerJoin(users, eq(tickets.userId, users.id))
    .innerJoin(categories, eq(tickets.categoryId, categories.id))
    .where(eq(tickets.id, ticketId));

  const ticket = result[0];

  if (!ticket) {
    notFound();
  }

  const status = ticket.status ?? "open";

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">

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

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-2 text-sm text-muted-foreground">
                Support Ticket #{ticket.id}
              </p>

              <h1 className="text-3xl font-bold tracking-tight">
                {ticket.title}
              </h1>

              <p className="mt-2 text-sm text-muted-foreground">
                Ticket details and support conversation.
              </p>
            </div>

            <Badge
              variant={
                status === "resolved"
                  ? "default"
                  : status === "in-progress"
                  ? "secondary"
                  : "outline"
              }
              className="w-fit px-4 py-1.5 text-sm"
            >
              {status === "in-progress"
                ? "In Progress"
                : status === "resolved"
                ? "Resolved"
                : "Open"}
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">

          {/* Vänster kolumn */}
          <div className="space-y-6 lg:col-span-2">

            {/* Beskrivning */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">
                  Description
                </CardTitle>

                <CardDescription>
                  Details about the reported issue.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <p className="whitespace-pre-wrap leading-7 text-muted-foreground">
                  {ticket.description}
                </p>
              </CardContent>
            </Card>

            {/* Kommentarer */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">
                  Comments
                </CardTitle>

                <CardDescription>
                  View and participate in the support conversation.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">

                {/* Befintliga kommentarer */}
                {allComments.length === 0 ? (
                  <div className="rounded-lg border border-dashed bg-muted/20 px-4 py-10 text-center">
                    <h3 className="font-semibold">
                      No comments yet
                    </h3>

                    <p className="mt-2 text-sm text-muted-foreground">
                      Be the first to add a comment to this ticket.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allComments.map((comment) => (
                      <div
                        key={comment.id}
                        className="rounded-xl border bg-background p-4"
                      >
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <Badge variant="outline">
                            Comment
                          </Badge>

                          <span className="text-xs text-muted-foreground">
                            {comment.createdAt.toLocaleString("sv-SE")}
                          </span>
                        </div>

                        <p className="whitespace-pre-wrap text-sm leading-7">
                          {comment.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <Separator />

                {/* Lägg till kommentar */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">
                      Add a comment
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Write a message about this support ticket.
                    </p>
                  </div>

                  <form
                    action={createComment}
                    className="space-y-4"
                  >
                    <input
                      type="hidden"
                      name="ticketId"
                      value={ticket.id}
                    />

                    <Textarea
                      name="content"
                      placeholder="Write your comment here..."
                      required
                      rows={4}
                      className="resize-y bg-background"
                    />

                    <div className="flex justify-end">
                      <Button type="submit">
                        Add Comment
                      </Button>
                    </div>
                  </form>
                </div>

              </CardContent>
            </Card>
          </div>

          {/* Höger kolumn */}
          <div className="space-y-6">

            {/* Ärendeinformation */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">
                  Ticket Information
                </CardTitle>

                <CardDescription>
                  Overview of this support ticket.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">

                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Ticket ID
                  </p>

                  <p className="font-semibold">
                    #{ticket.id}
                  </p>
                </div>

                <Separator />

                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Category
                  </p>

                  <p className="font-medium">
                    {ticket.categoryName}
                  </p>
                </div>

                <Separator />

                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Created
                  </p>

                  <p className="font-medium">
                    {ticket.createdAt.toLocaleString("sv-SE")}
                  </p>
                </div>

                <Separator />

                <div>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Reported By
                  </p>

                  <p className="font-medium">
                    {ticket.userName}
                  </p>

                  <p className="mt-1 break-all text-sm text-muted-foreground">
                    {ticket.userEmail}
                  </p>
                </div>

              </CardContent>
            </Card>

            {/* Uppdatera status */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">
                  Update Status
                </CardTitle>

                <CardDescription>
                  Change the current status of this ticket.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form
                  action={updateTicketStatus}
                  className="space-y-4"
                >
                  <input
                    type="hidden"
                    name="ticketId"
                    value={ticket.id}
                  />

                  <div className="space-y-2">
                    <label
                      htmlFor="status"
                      className="text-sm font-medium"
                    >
                      Ticket Status
                    </label>

                    <select
                      id="status"
                      name="status"
                      defaultValue={status}
                      className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>

                  <Button type="submit" className="w-full">
                    Save Status
                  </Button>
                </form>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* Tillbaka längst ner */}
        <div className="mt-8 border-t pt-6">
          <Button variant="outline">
            <Link href="/tickets">
              ← Back to Tickets
            </Link>
          </Button>
        </div>

      </div>
    </main>
  );
}
