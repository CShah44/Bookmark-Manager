import { CollectionConfig } from "payload";

export const Folders: CollectionConfig = {
  slug: "folders",
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "userId",
      type: "text",
      required: true,
    },
  ],
};
