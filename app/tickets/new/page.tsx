import Link from "next/link";

import { db } from "@/db";
import { users, categories } from "@/db/schema";

import { createTicket } from "./actions"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button"

export default async function NewTicketPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string}>;
}) {

    const allUsers = await db.select().from(users);
    const allCategories = await db.select().from(categories);

    const { error } = await searchParams;

    return(
        <main className="min-h-screen flex justify-center p-6 bg-grey-50">

            <Card className="w-full max-w-lg h-fit">

                <CardHeader>
                    <CardTitle>Create New Ticket</CardTitle>
                </CardHeader>

                <CardContent>

                    {error && (
                        <p role="alert" className="text-red-600 mb-4">
                            {error === "missing"
                            ? "Please fill in all fields."
                            : "Please select valid users and categories."}
                        </p>
                    )}

                    <form action={createTicket} className="flex flex-col gap-4">

                        {/* Title */}
                        <div>
                            <label className="block mb-1 font-medium">
                                Title
                            </label>

                            <input
                            type="text"
                            name="title"
                            required
                            className="w-full border rounded-md p2"
                            placeholder="Enter ticket title"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block mb-1 font-medium">
                                Description
                            </label>

                            <textarea
                            name="description"
                            required
                            className="w-full border rounded-md p-2"
                            rows={4}
                            />
                        </div>

                        {/* Users */}
                        <div>
                            <label className="block mb-1 font-medium">
                                Reported by
                            </label>

                            <select
                            name="userId"
                            required
                            defaultValue=""
                            className="w-full border rounded-md p-2"
                            >
                                <option value="" disabled>
                                    Select a user
                                </option>

                                {allUsers.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block mb-1 font-medium">
                                Category
                            </label>

                            <select
                            name="categoryId"
                            required
                            defaultValue=""
                            className="w-full border rounded-md p-2"
                            >
                                <option value="" disabled>
                                    Select a category
                                </option>

                                {allCategories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <Button type="submit" className="w-full">
                            Create Ticket
                        </Button>

                        <Link
                        href="/tickets"
                        className="text-center text-sm text-gray-600 hover:underline"
                        >
                        Back to tickets
                        </Link>

                    </form>

                </CardContent>
            </Card>

        </main>
    );
}