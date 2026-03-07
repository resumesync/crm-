/**
 * Time Picker Component
 * A beautiful dropdown-based time picker with hour, minute, and AM/PM selectors
 */
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Clock, ChevronUp, ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TimePickerProps {
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
    placeholder?: string;
}

const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

export function TimePicker({
    value = "",
    onChange,
    className,
    placeholder = "Select time"
}: TimePickerProps) {
    const [open, setOpen] = React.useState(false);

    // Parse current value
    const parseTime = (timeStr: string) => {
        if (!timeStr) return { hour: "12", minute: "00", period: "AM" };

        const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
        if (match) {
            let hour = match[1];
            const minute = match[2];
            const period = match[3]?.toUpperCase() || "AM";

            // Handle 24-hour format
            if (!match[3]) {
                const hourNum = parseInt(hour);
                if (hourNum >= 12) {
                    hour = hourNum === 12 ? "12" : (hourNum - 12).toString().padStart(2, '0');
                    return { hour, minute, period: "PM" };
                } else if (hourNum === 0) {
                    return { hour: "12", minute, period: "AM" };
                }
            }

            return { hour: hour.padStart(2, '0'), minute, period };
        }
        return { hour: "12", minute: "00", period: "AM" };
    };

    const { hour, minute, period } = parseTime(value);

    const [selectedHour, setSelectedHour] = React.useState(hour);
    const [selectedMinute, setSelectedMinute] = React.useState(minute);
    const [selectedPeriod, setSelectedPeriod] = React.useState(period);

    // Update selected values when value prop changes
    React.useEffect(() => {
        const { hour, minute, period } = parseTime(value);
        setSelectedHour(hour);
        setSelectedMinute(minute);
        setSelectedPeriod(period);
    }, [value]);

    const handleTimeChange = (newHour: string, newMinute: string, newPeriod: string) => {
        setSelectedHour(newHour);
        setSelectedMinute(newMinute);
        setSelectedPeriod(newPeriod);
        const timeStr = `${newHour}:${newMinute} ${newPeriod}`;
        onChange?.(timeStr);
    };

    const formatDisplayTime = () => {
        if (!value && !selectedHour) return "";
        return `${selectedHour}:${selectedMinute} ${selectedPeriod}`;
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !value && "text-muted-foreground",
                        className
                    )}
                >
                    <Clock className="mr-2 h-4 w-4" />
                    {formatDisplayTime() || placeholder}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <div className="flex items-center gap-0 p-4">
                    {/* Hour Selector */}
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-muted-foreground mb-2">Hour</span>
                        <div className="relative">
                            <ScrollArea className="h-[180px] w-[60px] rounded-md border bg-background">
                                <div className="p-2">
                                    {hours.map((h) => (
                                        <button
                                            key={h}
                                            onClick={() => handleTimeChange(h, selectedMinute, selectedPeriod)}
                                            className={cn(
                                                "w-full py-2 px-3 text-center rounded-md text-sm transition-colors",
                                                selectedHour === h
                                                    ? "bg-primary text-primary-foreground font-medium"
                                                    : "hover:bg-accent"
                                            )}
                                        >
                                            {h}
                                        </button>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    </div>

                    <span className="text-2xl font-bold mx-2 self-center mt-6">:</span>

                    {/* Minute Selector */}
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-muted-foreground mb-2">Min</span>
                        <ScrollArea className="h-[180px] w-[60px] rounded-md border bg-background">
                            <div className="p-2">
                                {minutes.filter((_, i) => i % 5 === 0).map((m) => (
                                    <button
                                        key={m}
                                        onClick={() => handleTimeChange(selectedHour, m, selectedPeriod)}
                                        className={cn(
                                            "w-full py-2 px-3 text-center rounded-md text-sm transition-colors",
                                            selectedMinute === m
                                                ? "bg-primary text-primary-foreground font-medium"
                                                : "hover:bg-accent"
                                        )}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* AM/PM Selector */}
                    <div className="flex flex-col items-center ml-2">
                        <span className="text-xs text-muted-foreground mb-2">Period</span>
                        <div className="flex flex-col gap-1">
                            <button
                                onClick={() => handleTimeChange(selectedHour, selectedMinute, "AM")}
                                className={cn(
                                    "py-3 px-4 rounded-md text-sm font-medium transition-colors",
                                    selectedPeriod === "AM"
                                        ? "bg-primary text-primary-foreground"
                                        : "border hover:bg-accent"
                                )}
                            >
                                AM
                            </button>
                            <button
                                onClick={() => handleTimeChange(selectedHour, selectedMinute, "PM")}
                                className={cn(
                                    "py-3 px-4 rounded-md text-sm font-medium transition-colors",
                                    selectedPeriod === "PM"
                                        ? "bg-primary text-primary-foreground"
                                        : "border hover:bg-accent"
                                )}
                            >
                                PM
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Select */}
                <div className="border-t px-4 py-3">
                    <p className="text-xs text-muted-foreground mb-2">Quick select</p>
                    <div className="flex flex-wrap gap-2">
                        {["09:00 AM", "10:00 AM", "02:00 PM", "04:00 PM", "06:00 PM"].map((time) => (
                            <Button
                                key={time}
                                variant="outline"
                                size="sm"
                                className="text-xs"
                                onClick={() => {
                                    const { hour, minute, period } = parseTime(time);
                                    handleTimeChange(hour, minute, period);
                                    setOpen(false);
                                }}
                            >
                                {time}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Done Button */}
                <div className="border-t p-3">
                    <Button className="w-full" onClick={() => setOpen(false)}>
                        Done
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default TimePicker;
