"use server";

import { getPayload } from "payload";
import configPromise from "@payload-config";
import { auth } from "@clerk/nextjs/server";

const payload = await getPayload({ config: configPromise });

interface Bookmark {
  title: string;
  url: string;
  description: string;
  tags: string[];
  folder: string;
}

export const getUserBookmarks = async () => {
  const { userId: uid } = await auth();

  if (!uid) {
    throw new Error("User not authenticated");
  }

  try {
    const bookmarks = await payload.find({
      collection: "bookmarks",
      where: {
        userId: {
          equals: uid,
        },
      },
    });

    return bookmarks.docs;
  } catch (error) {
    throw new Error("Error fetching bookmarks. " + error);
  }
};

export const createBookmark = async (bookmark: Bookmark) => {
  const { userId: uid } = await auth();

  if (!uid) {
    throw new Error("User not authenticated");
  }

  try {
    const newBookmark = await payload.create({
      collection: "bookmarks",
      data: {
        title: bookmark.title,
        url: bookmark.url,
        description: bookmark.description,
        // map the tags array to an array of objects with a tag property and an id property
        tags: bookmark.tags.map((tag) => ({ tag })),
        folder: bookmark.folder,
        userId: uid,
      },
    });

    return newBookmark;
  } catch (error) {
    throw new Error("Error creating bookmark. " + error);
  }
};

export const deleteBookmark = async (bookmarkId: string) => {
  const { userId: uid } = await auth();

  if (!uid) {
    throw new Error("User not authenticated");
  }

  try {
    await payload.delete({
      collection: "bookmarks",
      id: bookmarkId,
    });
  } catch (error) {
    throw new Error("Error deleting bookmark. " + error);
  }
};
