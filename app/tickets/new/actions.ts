"use server";

import { db } from "@/db";
import { tickets } from "@/db/schema";
import { redirect } from "next/navigation";

export async function createTicket(formData: FormData) {

    const title = formData.get("title");
    const description = formData.get("description");
    const userId = formData.get("userId");
    const categoryId = formData.get("categoryId");

    if (
        typeof title !== "string" ||
        typeof description !== "string" ||
        typeof userId !== "string" ||
        typeof categoryId !== "string" ||
        !title.trim() ||
        !description.trim() ||
        !userId ||
        !categoryId
    ) {
        redirect("/tickets/new?error=missing");
    }

    const userIdNumber = Number(userId);
    const categoryIdNumber = Number(categoryId);

    if(
        !Number.isInteger(userIdNumber) ||
        userIdNumber < 1 ||
        !Number.isInteger(categoryIdNumber) ||
        categoryIdNumber < 1
    ) {
        redirect("/tickets/new?error=invalid")
    }

    await db.insert(tickets).values({
    title: title.trim(),
    description: description.trim(),
    userId: userIdNumber,
    categoryId: categoryIdNumber,
  });

  redirect("/tickets");
}