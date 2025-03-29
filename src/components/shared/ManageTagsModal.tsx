import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface ManageTagsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tags: string[];
  onAddTag: (name: string) => void;
  onDeleteTag: (name: string) => void;
}

export default function ManageTagsModal({
  isOpen,
  onClose,
  tags,
  onAddTag,
  onDeleteTag,
}: ManageTagsModalProps) {
  const [newTagName, setNewTagName] = useState("");

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagName.trim()) {
      onAddTag(newTagName.trim());
      setNewTagName("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Tags</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleAddTag} className="flex gap-2 mb-4">
          <Input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="New tag name"
            className="flex-1"
          />
          <Button type="submit">Add</Button>
        </form>

        <div className="flex flex-wrap gap-2 border rounded-md p-3">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center bg-secondary text-secondary-foreground rounded-full px-3 py-1"
              >
                <span className="text-sm">{tag}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteTag(tag)}
                  className="ml-1 h-5 w-5 p-0 hover:bg-transparent"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))
          ) : (
            <div className="w-full text-center text-muted-foreground">
              No tags yet
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
