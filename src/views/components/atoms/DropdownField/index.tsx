import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export type DropdownFieldOption = {
  label: string;
  value: string;
};

type DropdownFieldProps = {
  label: string;
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  options: DropdownFieldOption[];
  placeholder: string;
};

export default function DropdownField({
  label,
  name,
  onChange,
  options,
  placeholder,
  value,
}: DropdownFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState("");
  const [openDirection, setOpenDirection] = useState<"top" | "bottom">(
    "bottom"
  );
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const selectedValue = value ?? internalValue;
  const selectedLabel =
    options.find((option) => option.value === selectedValue)?.label ?? "";

  const updateValue = (nextValue: string) => {
    if (onChange) {
      onChange(nextValue);
      return;
    }

    setInternalValue(nextValue);
  };

  const updateOpenDirection = useCallback(() => {
    const rect = wrapperRef.current?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    const expectedPanelHeight = Math.min(260, 44 + options.length * 40);
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const shouldOpenTop =
      spaceBelow < expectedPanelHeight && spaceAbove > spaceBelow;

    setOpenDirection(shouldOpenTop ? "top" : "bottom");
  }, [options.length]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleViewportChange = () => updateOpenDirection();

    window.addEventListener("scroll", handleViewportChange, true);
    window.addEventListener("resize", handleViewportChange);

    return () => {
      window.removeEventListener("scroll", handleViewportChange, true);
      window.removeEventListener("resize", handleViewportChange);
    };
  }, [isOpen, updateOpenDirection]);

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block">
        <span className="text-sm font-semibold text-slate-600">{label}</span>
        <input type="hidden" name={name} value={selectedValue} />
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={() => {
            updateOpenDirection();
            setIsOpen((current) => !current);
          }}
          className={[
            "mt-2 flex h-12 w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-4 text-left text-sm outline-none transition focus:border-[#006B80] focus:ring-2 focus:ring-[#006B80]/10",
            selectedValue ? "text-slate-950" : "text-slate-500",
          ].join(" ")}
        >
          <span className="truncate">{selectedLabel || placeholder}</span>
          <ChevronDown
            className={[
              "ml-3 h-4 w-4 shrink-0 text-slate-500 transition",
              isOpen ? "rotate-180 text-[#006B80]" : "",
            ].join(" ")}
            strokeWidth={2}
          />
        </button>
      </label>

      {isOpen ? (
        <div
          className={[
            "absolute left-0 z-30 max-h-64 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg shadow-slate-900/10",
            openDirection === "top" ? "bottom-full mb-2" : "top-full mt-2",
          ].join(" ")}
        >
          <button
            type="button"
            onClick={() => {
              updateValue("");
              setIsOpen(false);
            }}
            className="block w-full px-4 py-2.5 text-left text-sm font-medium text-slate-500 transition hover:bg-cyan-50 hover:text-[#006B80]"
          >
            {placeholder}
          </button>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                updateValue(option.value);
                setIsOpen(false);
              }}
              className={[
                "block w-full px-4 py-2.5 text-left text-sm font-medium transition hover:bg-cyan-50 hover:text-[#006B80]",
                selectedValue === option.value
                  ? "bg-cyan-50 text-[#006B80]"
                  : "text-slate-700",
              ].join(" ")}
            >
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
