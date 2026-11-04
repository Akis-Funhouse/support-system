
import Link from "next/link";

import { db } from "@/db";
import { tickets, users, categories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function TicketsPage() {
    "use cache"

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
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-2">
          Support Tickets
        </h1>

        <p className="text-gray-600 mb-8">
          View and manage all reported support tickets.
        </p>

        <div className="grid gap-4">

          {allTickets.length === 0 ? (
            <p>No support tickets found.</p>
          ) : (
            allTickets.map((ticket) => {
              const status = ticket.status ?? "open";

              return (
                <Link
                  href={`/tickets/${ticket.id}`}
                  key={ticket.id}
                >
                  <Card className="hover:shadow-md cursor-pointer">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">

                        <CardTitle className="text-xl">
                          {ticket.title}
                        </CardTitle>

                        <span
                          className={`text-sm font-semibold px-3 py-1 rounded-full w-fit ${
                            status === "open"
                              ? "bg-green-200 text-green-600"
                              : status === "in-progress"
                              ? "bg-yellow-200 text-yellow-600"
                              : "bg-blue-200 text-blue-600"
                          }`}
                        >
                          {status === "in-progress"
                            ? "In Progress"
                            : status === "resolved"
                            ? "Resolved"
                            : "Open"}
                        </span>

                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="grid gap-2 text-sm text-gray-600">

                        <p>
                          <strong>Category:</strong>{" "}
                          {ticket.categoryName}
                        </p>

                        <p>
                          <strong>Reported by:</strong>{" "}
                          {ticket.userName}
                        </p>

                        <p>
                          <strong>Created:</strong>{" "}
                          {ticket.createdAt.toLocaleString("sv-SE")}
                        </p>

                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          )}

        </div>
      </div>
    </main>
  );
}
