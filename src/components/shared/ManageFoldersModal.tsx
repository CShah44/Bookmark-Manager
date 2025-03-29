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
import { Trash2 } from "lucide-react";

interface ManageFoldersModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: string[];
  onAddFolder: (name: string) => void;
  onDeleteFolder: (name: string) => void;
}

export default function ManageFoldersModal({
  isOpen,
  onClose,
  folders,
  onAddFolder,
  onDeleteFolder,
}: ManageFoldersModalProps) {
  const [newFolderName, setNewFolderName] = useState("");

  const handleAddFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      onAddFolder(newFolderName.trim());
      setNewFolderName("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Folders</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleAddFolder} className="flex gap-2 mb-4">
          <Input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="New folder name"
            className="flex-1"
          />
          <Button type="submit">Add</Button>
        </form>

        <div className="border rounded-md overflow-hidden">
          {folders.length > 0 ? (
            <ul className="divide-y">
              {folders.map((folder) => (
                <li
                  key={folder}
                  className="flex justify-between items-center p-3"
                >
                  <span>{folder}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteFolder(folder)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-3 text-center text-muted-foreground">
              No folders yet
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
