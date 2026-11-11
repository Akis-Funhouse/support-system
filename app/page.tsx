
import Link from "next/link";

import { db } from "@/db";
import { users } from "@/db/schema";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function ItSystem() {
  "use cache";

  const allUsers = await db.select().from(users);

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">

        {/* Sidhuvud */}
        <div className="mb-8">
          <Badge variant="secondary" className="mb-3">
            IT Department
          </Badge>

          <h1 className="text-3xl font-bold tracking-tight">
            IT Support System
          </h1>

          <p className="mt-2 text-muted-foreground">
            Welcome to the IT support dashboard.
            Create support tickets and manage reported issues.
          </p>
        </div>

        {/* Huvudkort */}
        <div className="mb-10 grid gap-4 md:grid-cols-2">

          {/* Support */}
          <Card className="border-0 shadow-md">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  Support Tickets
                </CardTitle>

                <Badge variant="outline">
                  Support
                </Badge>
              </div>

              <CardDescription>
                Need help with something? Create a ticket,
                describe your problem and send it to our IT
                support team.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-3">
              <Button className="w-full">
                <Link href="/tickets/new">
                  Create a New Ticket
                </Link>
              </Button>

              <Button variant="outline" className="w-full">
                <Link href="/tickets">
                  View All Tickets
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Users */}
          <Card className="border-0 shadow-md">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">
                  Registered Users
                </CardTitle>

                <Badge variant="secondary">
                  {allUsers.length} Users
                </Badge>
              </div>

              <CardDescription>
                View all users currently registered in
                the IT support system.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-3xl font-bold tracking-tight">
                  {allUsers.length}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Registered users in the database
                </p>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Användarlista */}
        <section>
          <div className="mb-5">
            <h2 className="text-2xl font-bold tracking-tight">
              Registered Users
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Users currently stored in the database.
            </p>
          </div>

          {allUsers.length === 0 ? (
            <Card className="border-dashed shadow-none">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <h3 className="font-semibold">
                  No users found
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  There are currently no registered users.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {allUsers.map((user) => (
                <Card
                  key={user.id}
                  className="border-0 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-base">
                      {user.name}
                    </CardTitle>

                    <CardDescription className="break-all">
                      {user.email}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
