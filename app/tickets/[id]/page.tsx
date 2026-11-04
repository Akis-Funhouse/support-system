import { db } from "@/db";
import { tickets, users, categories } from "@/db/schema";
import { updateTicketStatus } from "./actions";

import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const instant = false;

export default async function TicketPage({
    params,
}: {
    params: Promise<{ id: string}>;
}) {

    const { id } = await params;
    const ticketId = Number(id);

    if (!Number.isSafeInteger(ticketId) || ticketId < 1) {
        notFound();
    }

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

    return(
        <main className="min-h-screen bg-muted/40 px-4 py-10 sm:px-6">
  <div className="mx-auto max-w-3xl">

    {/* Tillbaka-länk */}
    <Button variant="ghost" className="mb-6 -ml-3">
      <Link href="/tickets">
        ← Back to tickets
      </Link>
    </Button>

    {/* Ärendets innehåll */}
    <Card className="border-0 shadow-md">

      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            Support ticket #{ticket.id}
          </p>

          <Badge
            variant={
              ticket.status === "resolved"
                ? "default"
                : ticket.status === "in-progress"
                ? "secondary"
                : "outline"
            }
            className="px-3 py-1"
          >
            {ticket.status === "in-progress"
              ? "In progress"
              : ticket.status === "resolved"
              ? "Resolved"
              : "Open"}
          </Badge>
        </div>

        <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">
          {ticket.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">

        {/* Beskrivning */}
        <section>
          <h2 className="mb-3 text-lg font-semibold">
            Description
          </h2>

          <p className="whitespace-pre-wrap leading-7 text-muted-foreground">
            {ticket.description}
          </p>
        </section>

        <Separator />

        {/* Ärendeinformation */}
        <section className="grid gap-6 sm:grid-cols-2">

          <div>
            <h2 className="mb-1 text-sm font-medium text-muted-foreground">
              Category
            </h2>
            <p className="font-medium">
              {ticket.categoryName}
            </p>
          </div>

          <div>
            <h2 className="mb-1 text-sm font-medium text-muted-foreground">
              Created
            </h2>
            <p className="font-medium">
              {ticket.createdAt.toLocaleString("sv-SE")}
            </p>
          </div>

          <div className="sm:col-span-2">
            <h2 className="mb-1 text-sm font-medium text-muted-foreground">
              Reported by
            </h2>
            <p className="font-medium">
              {ticket.userName}
            </p>
            <p className="text-sm text-muted-foreground">
              {ticket.userEmail}
            </p>
          </div>

        </section>

        <Separator />

        {/* Ändra status */}
        <section className="rounded-xl bg-muted/50 p-5">
          <h2 className="mb-1 text-lg font-semibold">
            Update ticket status
          </h2>

          <p className="mb-5 text-sm text-muted-foreground">
            Choose a new status for this support ticket.
          </p>

          <form
            action={updateTicketStatus}
            className="flex flex-col gap-4 sm:flex-row sm:items-end"
          >
            <input
              type="hidden"
              name="ticketId"
              value={ticket.id}
            />

            <div className="flex-1 space-y-2">
              <label
                htmlFor="status"
                className="text-sm font-medium"
              >
                New status
              </label>

              <select
                id="status"
                name="status"
                defaultValue={ticket.status ?? "open"}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="open">Open</option>
                <option value="in-progress">In progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <Button type="submit" className="w-full sm:w-auto">
              Save status
            </Button>
          </form>
        </section>

      </CardContent>
    </Card>

  </div>
</main>
    );

}