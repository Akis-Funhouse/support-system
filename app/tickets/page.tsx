import { db } from "@/db";
import { tickets, users, categories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const instant = false;

export default async function TicketsPage() {

  const allTickets = await db
    .select({
      id: tickets.id,
      title: tickets.title,
      description: tickets.description,
      status: tickets.status,
      createdAt: tickets.createdAt,
      userName: users.name,
      categoryName: categories.name,
    })
    .from(tickets)
    .innerJoin(users, eq(tickets.userId, users.id))
    .innerJoin(categories, eq(tickets.categoryId, categories.id))
    .orderBy(desc(tickets.createdAt));

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-10 sm:px-6">
  <div className="mx-auto max-w-5xl">

    {/* Sidhuvud */}
    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Support Tickets
        </h1>

        <p className="mt-2 text-muted-foreground">
          View and manage all reported support tickets.
        </p>
      </div>

      <Button>
        <Link href="/tickets/new">
          + Create New Ticket
        </Link>
      </Button>
    </div>

    {/* Lista med ärenden */}
    {allTickets.length === 0 ? (
      <Card className="border-dashed shadow-none">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <h2 className="text-lg font-semibold">
            No support tickets found
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Create your first support ticket to get started.
          </p>

          <Button className="mt-5">
            <Link href="/tickets/new">
              Create New Ticket
            </Link>
          </Button>
        </CardContent>
      </Card>
    ) : (
      <div className="grid gap-4">

        {allTickets.map((ticket) => {
          const status = ticket.status ?? "open";

          return (
            <Link
              href={`/tickets/${ticket.id}`}
              key={ticket.id}
              className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Card className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-ring">

                <CardHeader>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    <CardTitle className="text-xl transition-colors group-hover:text-primary">
                      {ticket.title}
                    </CardTitle>

                    <Badge
                      variant={
                        status === "resolved"
                          ? "default"
                          : status === "in-progress"
                          ? "secondary"
                          : "outline"
                      }
                      className="w-fit px-3 py-1"
                    >
                      {status === "in-progress"
                        ? "In Progress"
                        : status === "resolved"
                        ? "Resolved"
                        : "Open"}
                    </Badge>

                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid gap-3 text-sm sm:grid-cols-3">

                    <div>
                      <p className="mb-1 text-muted-foreground">
                        Category
                      </p>

                      <p className="font-medium">
                        {ticket.categoryName}
                      </p>
                    </div>

                    <div>
                      <p className="mb-1 text-muted-foreground">
                        Reported by
                      </p>

                      <p className="font-medium">
                        {ticket.userName}
                      </p>
                    </div>

                    <div>
                      <p className="mb-1 text-muted-foreground">
                        Created
                      </p>

                      <p className="font-medium">
                        {ticket.createdAt.toLocaleString("sv-SE")}
                      </p>
                    </div>

                  </div>
                </CardContent>

              </Card>
            </Link>
          );
        })}

      </div>
    )}

  </div>
</main>
  );
}
