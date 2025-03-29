import { CollectionConfig } from "payload";

export const Bookmarks: CollectionConfig = {
  slug: "bookmarks",
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "url",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
      required: false,
    },
    {
      name: "folder",
      type: "text",
      required: false,
    },
    {
      name: "tags",
      type: "array",
      fields: [
        {
          name: "tag",
          type: "text",
          required: true,
        },
      ],
      required: false,
    },
    {
      name: "userId",
      type: "text",
      required: true,
    },
  ],
};
