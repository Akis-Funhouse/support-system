import { db } from "@/db";
import { tickets, users, categories } from "@/db/schema";

import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

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
        <main className="min-h-screen bg-gray-100 p-6">

            <div className="max-w-3xl mx-auto">

                <a
                href="/tickets"
                className="text-blie-600 hover:underline mb-6 inline-block"
                >
                 Back to tickets
                </a>

                <div className="bg-white rounded-xl shadow-sm p-6">

                    <h1 className="text-3xl font-bold mb-4">
                        {ticket.title}
                    </h1>

                    <div className="mb-6">
                        <span className="font-semibold">
                            Status:
                        </span>

                        <span className="px-3 py-1 rounded-full bg-blue-200 text-blue-600">
                            {ticket.status === "in-progress"
                            ? "In progress"
                            : ticket.status === "resolved"
                            ? "Resolved"
                            : "Open"}
                        </span>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">
                            Description
                        </h2>

                        <p className="text-gray-700 whitespace-pre-wrap">
                            {ticket.description}
                        </p>
                    </div>

                    <hr className="my-6"/>

                    <div className="mb-4">
                        <h2 className="font-semibold">
                            Category
                        </h2>

                        <p className="text-gray-600">
                            {ticket.categoryName}
                        </p>
                    </div>

                    <div className="mb-4">
                        <h2 className="font-semibold">
                            Reported by
                        </h2>

                        <p className="text-gray-600">
                            {ticket.userName}
                        </p>

                        <p className="text-gray-600">
                            {ticket.userEmail}
                        </p>
                    </div>

                    <div>
                        <h2 className="font-semibold">
                            Created
                        </h2>

                        <p>
                            {ticket.createdAt.toLocaleString("sv-SE")}
                        </p>
                    </div>

                </div>
            </div>
        </main>
    );

}