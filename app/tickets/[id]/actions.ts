"use server";

import { db } from "@/db";
import { tickets, comments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

const allowedStatuses = ["open", "in-progress", "resolved"] as const;

export async function updateTicketStatus(formData: FormData) {
  const ticketId = Number(formData.get("ticketId"));
  const status = formData.get("status");

  if (!Number.isSafeInteger(ticketId) || ticketId <= 0) {
    notFound();
  }

  if (
    typeof status !== "string" ||
    !allowedStatuses.includes(status as (typeof allowedStatuses)[number])
  ) {
    throw new Error("Ogiltig status.");
  }

  const validStatus = status as (typeof allowedStatuses)[number];

  const updatedTickets = await db
    .update(tickets)
    .set({ status: validStatus })
    .where(eq(tickets.id, ticketId))
    .returning({ id: tickets.id });

  if (updatedTickets.length === 0) {
    notFound();
  }

  revalidatePath("/tickets");
  revalidatePath(`/tickets/${ticketId}`);

  redirect(`/tickets/${ticketId}`);
}

export async function createComment(formData: FormData) {
  const ticketId = Number(formData.get("ticketId"));
  const content = formData.get("content");

  if (!Number.isSafeInteger(ticketId) || ticketId <= 0) {
    notFound();
  }

  if (typeof content !== "string") {
    throw new Error("Ogiltig kommentar.");
  }

  const trimmedContent = content.trim();

  if (!trimmedContent) {
    throw new Error("Kommentaren får inte vara tom.");
  }

  const ticket = await db
    .select({ id: tickets.id })
    .from(tickets)
    .where(eq(tickets.id, ticketId));

  if (ticket.length === 0) {
    notFound();
  }

  await db.insert(comments).values({
    content: trimmedContent,
    ticketId: ticketId,
  });

  revalidatePath(`/tickets/${ticketId}`);

  redirect(`/tickets/${ticketId}`);
}