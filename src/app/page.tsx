"use client";

import { useState } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Tags, FolderPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModeToggle } from "@/components/shared/ModeToggle";
import BookmarkCard from "@/components/shared/BookMarkCard";
import AddBookmarkModal from "@/components/shared/AddBookmarkModal";
import ManageFoldersModal from "@/components/shared/ManageFoldersModal";
import ManageTagsModal from "@/components/shared/ManageTagsModal";
import Link from "next/link";

// Sample data
const initialBookmarks = [
  {
    id: "1",
    title: "Next.js Documentation",
    url: "https://nextjs.org/docs",
    description: "Learn about Next.js features and API.",
    favicon: "https://nextjs.org/favicon.ico",
    tags: ["development", "react"],
    folder: "Learning",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Tailwind CSS",
    url: "https://tailwindcss.com",
    description: "A utility-first CSS framework for rapid UI development.",
    favicon: "https://tailwindcss.com/favicon.ico",
    tags: ["design", "development"],
    folder: "Work",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Clerk Authentication",
    url: "https://clerk.com",
    description: "Complete user management for your applications.",
    favicon: "https://clerk.com/favicon.ico",
    tags: ["development", "auth"],
    folder: "Work",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Notion",
    url: "https://notion.so",
    description: "All-in-one workspace for notes, tasks, wikis, and databases.",
    favicon: "https://notion.so/favicon.ico",
    tags: ["productivity"],
    folder: "Personal",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "GitHub",
    url: "https://github.com",
    description: "Where the world builds software.",
    favicon: "https://github.com/favicon.ico",
    tags: ["development"],
    folder: "Work",
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    title: "Figma",
    url: "https://figma.com",
    description: "Collaborative interface design tool.",
    favicon: "https://figma.com/favicon.ico",
    tags: ["design"],
    folder: "Work",
    createdAt: new Date().toISOString(),
  },
];

const initialFolders = ["Work", "Personal", "Learning"];
const initialTags = ["development", "design", "productivity", "react", "auth"];

export default function Home() {
  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  const [folders, setFolders] = useState(initialFolders);
  const [tags, setTags] = useState(initialTags);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("All Folders");
  const [sortBy, setSortBy] = useState("Date Added");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFoldersModalOpen, setIsFoldersModalOpen] = useState(false);
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);

  // Filter bookmarks based on search, folder, and tag
  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const matchesSearch =
      searchQuery === "" ||
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.url.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFolder =
      selectedFolder === "All Folders" || bookmark.folder === selectedFolder;

    const matchesTag = !selectedTag || bookmark.tags.includes(selectedTag);

    return matchesSearch && matchesFolder && matchesTag;
  });

  // Sort bookmarks
  const sortedBookmarks = [...filteredBookmarks].sort((a, b) => {
    if (sortBy === "Date Added") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === "Name") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const handleAddBookmark = (newBookmark: {
    title: string;
    url: string;
    description: string;
    folder: string;
    tags: string[];
  }) => {
    const bookmarkWithId = {
      ...newBookmark,
      id: Date.now().toString(),
      favicon: `https://${new URL(newBookmark.url).hostname}/favicon.ico`,
      createdAt: new Date().toISOString(),
    };
    setBookmarks([bookmarkWithId, ...bookmarks]);

    // Add new folder if it doesn't exist
    if (newBookmark.folder && !folders.includes(newBookmark.folder)) {
      setFolders([...folders, newBookmark.folder]);
    }

    // Add new tags if they don't exist
    const newTags = newBookmark.tags.filter(
      (tag: string) => !tags.includes(tag)
    );
    if (newTags.length > 0) {
      setTags([...tags, ...newTags]);
    }
  };

  const handleAddFolder = (name: string) => {
    if (!folders.includes(name)) {
      setFolders([...folders, name]);
    }
  };

  const handleDeleteFolder = (name: string) => {
    setFolders(folders.filter((folder) => folder !== name));
    // Update bookmarks in this folder to have no folder
    setBookmarks(
      bookmarks.map((bookmark) =>
        bookmark.folder === name ? { ...bookmark, folder: "" } : bookmark
      )
    );
  };

  const handleAddTag = (name: string) => {
    if (!tags.includes(name)) {
      setTags([...tags, name]);
    }
  };

  const handleDeleteTag = (name: string) => {
    setTags(tags.filter((tag) => tag !== name));
    // Remove this tag from all bookmarks
    setBookmarks(
      bookmarks.map((bookmark) => ({
        ...bookmark,
        tags: bookmark.tags.filter((tag) => tag !== name),
      }))
    );
  };

  const handleDeleteBookmark = (id: string) => {
    setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== id));
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag === selectedTag ? null : tag);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-semibold">Bookmark Manager</div>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>

          <SignedIn>
            <div className="flex flex-col sm:flex-row gap-3 py-3 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search bookmarks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full"
                />
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <Select
                  value={selectedFolder}
                  onValueChange={setSelectedFolder}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Folder" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Folders">All Folders</SelectItem>
                    {folders.map((folder) => (
                      <SelectItem key={folder} value={folder}>
                        {folder}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Date Added">Date Added</SelectItem>
                    <SelectItem value="Name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsTagsModalOpen(true)}
                  title="Manage Tags"
                >
                  <Tags className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsFoldersModalOpen(true)}
                  title="Manage Folders"
                >
                  <FolderPlus className="h-4 w-4" />
                </Button>
                <Button onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Add Bookmark
                </Button>
              </div>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 py-3 border-t">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => handleTagSelect(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </SignedIn>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        <SignedOut>
          <div className="max-w-2xl mx-auto text-center py-12">
            <h1 className="text-4xl font-bold mb-6">
              Welcome to Bookmark Manager
            </h1>
            <p className="text-xl mb-8">
              Save, categorize, and manage your favorite links in one place.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <Link href="/sign-up">Get Started</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
            </div>
          </div>
        </SignedOut>

        <SignedIn>
          {sortedBookmarks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedBookmarks.map((bookmark) => (
                <BookmarkCard
                  key={bookmark.id}
                  bookmark={bookmark}
                  onDelete={() => handleDeleteBookmark(bookmark.id)}
                  onTagClick={handleTagSelect}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No bookmarks found</p>
              <Button className="mt-4" onClick={() => setIsAddModalOpen(true)}>
                Add Your First Bookmark
              </Button>
            </div>
          )}
        </SignedIn>
      </main>

      {/* Modals */}
      <AddBookmarkModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddBookmark}
      />

      <ManageFoldersModal
        isOpen={isFoldersModalOpen}
        onClose={() => setIsFoldersModalOpen(false)}
        folders={folders}
        onAddFolder={handleAddFolder}
        onDeleteFolder={handleDeleteFolder}
      />

      <ManageTagsModal
        isOpen={isTagsModalOpen}
        onClose={() => setIsTagsModalOpen(false)}
        tags={tags}
        onAddTag={handleAddTag}
        onDeleteTag={handleDeleteTag}
      />
    </div>
  );
}
