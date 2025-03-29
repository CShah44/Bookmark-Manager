"use server";

import { getPayload } from "payload";
import configPromise from "@payload-config";
import { auth } from "@clerk/nextjs/server";

const payload = await getPayload({ config: configPromise });

interface Folder {
  name: string;
}

export const getUserFolders = async () => {
  const { userId: uid } = await auth();

  if (!uid) {
    throw new Error("User not authenticated");
  }

  try {
    const folders = await payload.find({
      collection: "folders",
      where: {
        userId: {
          equals: uid,
        },
      },
    });

    return folders.docs;
  } catch (error) {
    throw new Error("Error fetching folders. " + error);
  }
};

export const createFolder = async (folder: Folder) => {
  const { userId: uid } = await auth();

  if (!uid) {
    throw new Error("User not authenticated");
  }

  try {
    await payload.create({
      collection: "folders",
      data: {
        name: folder.name,
        userId: uid,
      },
    });
  } catch (error) {
    throw new Error("Error creating folder. " + error);
  }
};

export const deleteFolderFromName = async (name: string) => {
  const { userId: uid } = await auth();

  if (!uid) {
    throw new Error("User not authenticated");
  }

  try {
    await payload.delete({
      collection: "folders",
      where: {
        name: {
          equals: name,
        },
      },
    });
  } catch (error) {
    throw new Error("Error deleting folder. " + error);
  }
};
