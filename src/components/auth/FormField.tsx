
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type FormFieldProps = {
    id: string,
    label: string,
    type: string,
    placeholder: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
};

export function FormField({ id, label, type, placeholder, value, onChange }: FormFieldProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id} className="text-foreground">
                {label}
            </Label>
            <Input
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required
                className="h-12 bg-background"
            />
        </div>
    )
}