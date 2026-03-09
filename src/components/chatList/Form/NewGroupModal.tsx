import { useState } from "react";
import ModalCenter from "@/components/ModalCenter";
import { useAppDispatch } from "@/store/hooks";
import { closeModal } from "@/store/slices/profile/modalSlice";
import { Group } from "@/types/group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function NewGroupModal() {
    const dispatch = useAppDispatch();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState<Group["type"]>("private");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // dispatch(createGroup({ title, description, type }))
        dispatch(closeModal());
    };

    return (
        <ModalCenter onClick={() => dispatch(closeModal())}>
            <form
                className="relative min-w-[356px] min-h-1/3 bg-background-surface p-4 rounded-xl shadow-custom-md space-y-6 flex flex-col justify-between"
                onClick={e => e.stopPropagation()}
                onSubmit={handleSubmit}
            >
                <div className="space-y-4">
                    <h2 className="text-center text-xl font-semibold text-foreground mb-4">
                        Create New Group
                    </h2>
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-foreground">Group Name</Label>
                        <Input
                            id="title"
                            type="text"
                            placeholder="Enter group name"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                            className="h-12 bg-background-elevated shadow-custom-md-inset"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-foreground">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="What is this group about?"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                            className="h-12 max-h-[300px] bg-background-elevated shadow-custom-md-inset"
                        />
                    </div>
                    <div className="space-y-0.5">
                        <Label htmlFor="type" className="text-sm text-foreground block mb-1">
                            Group Type
                        </Label>
                        <RadioGroup
                            id="type"
                            name="type"
                            value={type}
                            onValueChange={v => setType(v as Group["type"])}
                            className="flex flex-col gap-2"
                        >
                            <div className="flex items-center space-x-1">
                                <RadioGroupItem value="private" id="type-private" className="border-foreground/20 border" />
                                <Label htmlFor="type-private" className="text-sm cursor-pointer">
                                    Private
                                </Label>
                            </div>
                            <div className="flex items-center space-x-1">
                                <RadioGroupItem value="public" id="type-public" className="border-foreground/20 border" />
                                <Label htmlFor="type-public" className="text-sm cursor-pointer">
                                    Public
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
                <div className="flex gap-3 justify-end pt-4 border-t border-border">
                    <Button
                        type="button"
                        variant="ghost"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => dispatch(closeModal())}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={!title.trim()}
                    >
                        Create
                    </Button>
                </div>
            </form>
        </ModalCenter>
    );
}
