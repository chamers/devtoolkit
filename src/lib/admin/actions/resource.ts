// src/lib/admin/actions/resource.ts
"use server";

import { ResourceCreate } from "@/lib/types";
import { resources } from "../../../../database/schema";
import db from "../../../../database/drizzle";

export const createResource = async (params: ResourceCreate) => {
  try {
    const newResource = await db
      .insert(resources)
      .values({
        ...params,
      })
      .returning();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newResource[0])),
    };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Failed to create resource" };
  }
};
