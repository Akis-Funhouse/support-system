
import { db } from "@/db";
import { tickets, users, categories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

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

  const openTickets = allTickets.filter(
    (ticket) => (ticket.status ?? "open") === "open"
  ).length;

  const inProgressTickets = allTickets.filter(
    (ticket) => ticket.status === "in-progress"
  ).length;

  const resolvedTickets = allTickets.filter(
    (ticket) => ticket.status === "resolved"
  ).length;

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">

        {/* Sidhuvud */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge variant="secondary" className="mb-3">
              IT Department
            </Badge>

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

        {/* Statistik */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription>
                Total Tickets
              </CardDescription>

              <CardTitle className="text-3xl">
                {allTickets.length}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription>
                Open
              </CardDescription>

              <CardTitle className="text-3xl">
                {openTickets}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription>
                In Progress
              </CardDescription>

              <CardTitle className="text-3xl">
                {inProgressTickets}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardDescription>
                Resolved
              </CardDescription>

              <CardTitle className="text-3xl">
                {resolvedTickets}
              </CardTitle>
            </CardHeader>
          </Card>

        </div>

        {/* Ärendelista */}
        <section>
          <div className="mb-5">
            <h2 className="text-2xl font-bold tracking-tight">
              All Tickets
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Recently reported support issues.
            </p>
          </div>

          {allTickets.length === 0 ? (
            <Card className="border-dashed shadow-none">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">

                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                  <span className="text-2xl">📋</span>
                </div>

                <h3 className="text-lg font-semibold">
                  No support tickets found
                </h3>

                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  There are currently no reported issues.
                  Create your first support ticket to get started.
                </p>

                <Button className="mt-6">
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
                    <Card className="border-0 shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-ring">

                      <CardHeader className="space-y-3">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                          <div className="space-y-1">
                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                              Ticket #{ticket.id}
                            </p>

                            <CardTitle className="text-lg transition-colors group-hover:text-primary sm:text-xl">
                              {ticket.title}
                            </CardTitle>
                          </div>

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

                        <CardDescription className="line-clamp-2 leading-relaxed">
                          {ticket.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent>
                        <div className="grid gap-4 border-t pt-4 text-sm sm:grid-cols-3">

                          <div>
                            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              Category
                            </p>

                            <p className="font-medium">
                              {ticket.categoryName}
                            </p>
                          </div>

                          <div>
                            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              Reported by
                            </p>

                            <p className="font-medium">
                              {ticket.userName}
                            </p>
                          </div>

                          <div>
                            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
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
        </section>

        {/* Tillbaka */}
        <div className="mt-8 border-t pt-6">
          <Button variant="outline">
            <Link href="/">
              ← Back to Dashboard
            </Link>
          </Button>
        </div>

      </div>
    </main>
  );
}
