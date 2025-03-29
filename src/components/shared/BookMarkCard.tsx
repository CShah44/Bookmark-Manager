import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, Clipboard, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Bookmark } from "@/lib/types";

interface BookmarkCardProps {
  bookmark: Bookmark;
  onDelete: () => void;
  onTagClick: (tag: string) => void;
}

export default function BookmarkCard({
  bookmark,
  onDelete,
  onTagClick,
}: BookmarkCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-lg truncate">{bookmark.title}</h3>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground truncate block hover:text-primary"
            >
              {bookmark.url}
            </a>
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => navigator.clipboard.writeText(bookmark.url)}
                >
                  <Clipboard className="mr-2 h-4 w-4" />
                  <span>Copy URL</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
          {bookmark.description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {bookmark.tags &&
              bookmark.tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80"
                  onClick={() => onTagClick(tag.tag || "")}
                >
                  {tag.tag}
                </Badge>
              ))}
          </div>
          {bookmark.folder && (
            <span className="text-xs text-muted-foreground">
              {bookmark.folder}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
