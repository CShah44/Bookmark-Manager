"use client";

import { useEffect, useState } from "react";
import { SignedIn, SignedOut, useAuth, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Tags, FolderPlus, Loader2 } from "lucide-react";
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
import { Bookmark } from "@/lib/types";
import { toast } from "sonner";
import {
  createBookmark,
  deleteBookmark,
  getUserBookmarks,
} from "@/actions/bookmarkActions";
import {
  createFolder,
  deleteFolderFromName,
  getUserFolders,
} from "@/actions/folderActions";
import {
  createTag,
  deleteTagFromName,
  getUserTags,
} from "@/actions/tagActions";

export default function Home() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("All Folders");
  const [sortBy, setSortBy] = useState("Date Added");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFoldersModalOpen, setIsFoldersModalOpen] = useState(false);
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isSignedIn, isLoaded } = useAuth();

  // Fetch bookmarks, folders, and tags from the server
  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookmarks = await getUserBookmarks();
        const folders = await getUserFolders();
        const tags = await getUserTags();

        setBookmarks(bookmarks);
        setFolders(folders.map((folder) => folder.name));
        setTags(tags.map((tag) => tag.name));

        setLoading(false);
      } catch (error) {
        toast.error("Error fetching data" + error);
      }
    };

    if (isLoaded && isSignedIn) fetchData();
  }, [isSignedIn, isLoaded]);

  // Filter bookmarks based on search, folder, and tag
  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const matchesSearch =
      searchQuery === "" ||
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark?.description
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      bookmark.url.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFolder =
      selectedFolder === "All Folders" || bookmark.folder === selectedFolder;

    const matchesTag =
      !selectedTag || bookmark?.tags?.some((tag) => tag.tag === selectedTag);

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

  const handleAddBookmark = async (newBookmark: {
    title: string;
    url: string;
    description: string;
    folder: string;
    tags: string[];
  }) => {
    try {
      toast.promise(
        () =>
          createBookmark({
            title: newBookmark.title,
            url: newBookmark.url,
            description: newBookmark.description,
            folder: newBookmark.folder,
            tags: newBookmark.tags,
          }).then((b) => {
            setBookmarks([b, ...bookmarks]);
          }),
        {
          loading: "Adding bookmark...",
          success: "Bookmark added successfully",
          error: "Error adding bookmark",
        }
      );
    } catch (error) {
      toast.error("Error adding bookmark" + error);
    }

    // Add new folder if it doesn't exist
    if (newBookmark.folder && !folders.includes(newBookmark.folder)) {
      // add new folder to database
      try {
        await createFolder({
          name: newBookmark.folder,
        });
        setFolders([...folders, newBookmark.folder]);
      } catch (error) {
        toast.error("Error adding folder" + error);
      }
    }

    // Add new tags if they don't exist
    const newTags = newBookmark.tags.filter(
      (tag: string) => !tags.includes(tag)
    );
    if (newTags.length > 0) {
      // add new tags to database
      try {
        for (const tag of newTags) {
          await createTag({
            name: tag,
          });
        }
        setTags([...tags, ...newTags]);
      } catch (error) {
        toast.error("Error adding tag" + error);
      }
    }
  };

  const handleAddFolder = async (name: string) => {
    if (!folders.includes(name)) {
      // add new folder to database
      try {
        toast.promise(
          () =>
            createFolder({
              name,
            }).then(() => setFolders([...folders, name])),
          {
            loading: "Adding folder...",
            success: "Folder added successfully",
            error: "Error adding folder",
          }
        );
      } catch (error) {
        toast.error("Error adding folder" + error);
      }
    }
  };

  const handleDeleteFolder = async (name: string) => {
    // Delete this folder from database
    try {
      toast.promise(
        () =>
          deleteFolderFromName(name).then(() => {
            setFolders(folders.filter((folder) => folder !== name));
            setBookmarks(
              bookmarks.map((bookmark) =>
                bookmark.folder === name
                  ? { ...bookmark, folder: "" }
                  : bookmark
              )
            );
          }),
        {
          loading: "Deleting folder...",
          success: "Folder deleted successfully",
          error: "Error deleting folder",
        }
      );
    } catch (error) {
      toast.error("Error deleting folder" + error);
    }
  };

  const handleAddTag = async (name: string) => {
    if (!tags.includes(name)) {
      // add new tag to database
      try {
        toast.promise(
          () =>
            createTag({
              name,
            }),
          {
            loading: "Adding tag...",
            success: "Tag added successfully",
            error: "Error adding tag",
          }
        );

        setTags([...tags, name]);
      } catch (error) {
        toast.error("Error adding tag" + error);
      }
    }
  };

  const handleDeleteTag = async (name: string) => {
    setTags(tags.filter((tag) => tag !== name));

    // Delete this tag from database
    try {
      toast.promise(
        () =>
          deleteTagFromName(name).then(() => {
            setBookmarks(
              bookmarks.map((bookmark) => ({
                ...bookmark,
                tags: bookmark?.tags?.filter((tag) => tag.tag !== name),
              }))
            );
          }),
        {
          loading: "Deleting tag...",
          success: "Tag deleted successfully",
          error: "Error deleting tag",
        }
      );
    } catch (error) {
      toast.error("Error deleting tag" + error);
    }
  };

  const handleDeleteBookmark = async (id: string) => {
    // Delete bookmark from database
    try {
      toast.promise(
        () =>
          deleteBookmark(id).then(() => {
            setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== id));
          }),
        {
          loading: "Deleting bookmark...",
          success: "Bookmark deleted successfully",
          error: "Error deleting bookmark",
        }
      );
    } catch (error) {
      toast.error("Error deleting bookmark" + error);
    }
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag === selectedTag ? null : tag);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-light">
              <span className="font-bold">BloomBook</span>: Bookmark Manager
            </div>
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
          {(!isLoaded || loading) && (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin h-10 w-10 text-primary" />
            </div>
          )}
          {isSignedIn && isLoaded && !loading && sortedBookmarks.length > 0 && (
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
          )}{" "}
          {isSignedIn &&
            isLoaded &&
            !loading &&
            sortedBookmarks.length === 0 && (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No bookmarks found</p>
                <Button
                  className="mt-4"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  Add Your First Bookmark
                </Button>
              </div>
            )}
        </SignedIn>
      </main>

      {/* Modals */}
      <AddBookmarkModal
        isOpen={isAddModalOpen}
        folders={folders || []}
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
