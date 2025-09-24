// lib/admin/actions/resource.ts
"use server";

import db from "../../../../database/drizzle";
import { resources } from "../../../../database/schema";
import { resourceCreateSchema, type ResourceCreateInput } from "@/lib/validations";

export const createResource = async (params: ResourceCreateInput) => {
  try {
    // Validate on the server too (defense in depth)
    const input = resourceCreateSchema.parse(params);

    const now = new Date();
    const row = {
      ...input,
      createdAt: now,
      updatedAt: now,
      comments: [], // let DB default if you prefer
    };

    const [inserted] = await db.insert(resources).values(row).returning();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(inserted)),
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred while creating the resource",
    };
  }
};
