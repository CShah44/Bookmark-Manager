"use server";

import { getPayload } from "payload";
import configPromise from "@payload-config";
import { auth } from "@clerk/nextjs/server";

const payload = await getPayload({ config: configPromise });

interface Tag {
  name: string;
}

export const getUserTags = async () => {
  const { userId: uid } = await auth();

  if (!uid) {
    throw new Error("User not authenticated");
  }

  try {
    const tags = await payload.find({
      collection: "tags",
      where: {
        userId: {
          equals: uid,
        },
      },
    });
    return tags.docs;
  } catch (error) {
    throw new Error("Error fetching tags. " + error);
  }
};

export const createTag = async (tag: Tag) => {
  const { userId: uid } = await auth();

  if (!uid) {
    throw new Error("User not authenticated");
  }

  try {
    await payload.create({
      collection: "tags",
      data: {
        name: tag.name,
        userId: uid,
      },
    });
  } catch (error) {
    throw new Error("Error creating tag. " + error);
  }
};

export const deleteTagFromName = async (name: string) => {
  const { userId: uid } = await auth();

  if (!uid) {
    throw new Error("User not authenticated");
  }

  try {
    await payload.delete({
      collection: "tags",
      where: {
        name: {
          equals: name,
        },
      },
    });
  } catch (error) {
    throw new Error("Error deleting tag. " + error);
  }
};
