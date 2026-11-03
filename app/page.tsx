import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { db } from "@/db";
import { users } from "@/db/schema";

export default async function ItSystem() {
  "use cache"
  const allUsers = await db.select().from(users);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-6">

      {/* IT Support System */}
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>IT Support System</CardTitle>
          <CardDescription>
            You can create a ticket, describe the problem you're having
            and then send it in to our IT support team.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p>Ticket Content</p>
        </CardContent>

        <CardFooter>
          <Button variant="outline">Send ticket</Button>
        </CardFooter>
      </Card>

      {/* Users from PostgreSQL */}
      <div className="w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">
          Registered Users
        </h2>

        {allUsers.length === 0 ? (
          <p>No users found in the database.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {allUsers.map((user) => (
              <Card key={user.id}>
                <CardHeader>
                  <CardTitle>{user.name}</CardTitle>
                  <CardDescription>
                    {user.email}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
