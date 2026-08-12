import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";

export type DropdownFieldOption = {
  label: string;
  value: string;
};

type DropdownFieldProps = {
  label?: string;
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  options: DropdownFieldOption[];
  placeholder: string;
  disabled?: boolean;
};

export default function DropdownField({
  disabled = false,
  label,
  name,
  onChange,
  options,
  placeholder,
  value,
}: DropdownFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState("");
  const [inputText, setInputText] = useState("");
  const [openDirection, setOpenDirection] = useState<"top" | "bottom">(
    "bottom",
  );

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const selectedValue = value ?? internalValue;
  const selectedOption = options.find((option) => option.value === selectedValue);
  const selectedLabel = selectedOption?.label ?? "";

  // Synchronize input text when not open or when selected value changes
  useEffect(() => {
    if (!isOpen) {
      setInputText(selectedLabel);
    }
  }, [selectedLabel, isOpen]);

  // Filter options based on what user types in the main input
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(inputText.toLowerCase().trim()),
  );

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

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setInputText(selectedLabel);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    const handleViewportChange = () => updateOpenDirection();

    window.addEventListener("scroll", handleViewportChange, true);
    window.addEventListener("resize", handleViewportChange);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("scroll", handleViewportChange, true);
      window.removeEventListener("resize", handleViewportChange);
    };
  }, [isOpen, selectedLabel, updateOpenDirection]);

  const handleSelectOption = (optionValue: string, optionLabel: string) => {
    updateValue(optionValue);
    setInputText(optionLabel);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateValue("");
    setInputText("");
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      {label ? (
        <span className="block text-sm font-semibold text-slate-600 mb-2">
          {label}
        </span>
      ) : null}
      <input type="hidden" name={name} value={selectedValue} />

      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          disabled={disabled}
          value={inputText}
          placeholder={placeholder}
          onFocus={() => {
            if (disabled) return;
            updateOpenDirection();
            setIsOpen(true);
          }}
          onChange={(e) => {
            setInputText(e.target.value);
            if (!isOpen) {
              updateOpenDirection();
              setIsOpen(true);
            }
          }}
          className={[
            "h-12 w-full rounded-lg border border-slate-300 bg-white pl-4 pr-12 text-sm outline-none transition focus:border-[#3E9E9E] focus:ring-2 focus:ring-[#3E9E9E]/10 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400",
            selectedValue || inputText ? "font-medium text-slate-950" : "text-slate-500",
          ].join(" ")}
        />

        <div className="absolute right-3 flex items-center gap-1">
          {selectedValue ? (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              title="Hapus pilihan"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              if (disabled) return;
              if (isOpen) {
                setIsOpen(false);
                setInputText(selectedLabel);
              } else {
                updateOpenDirection();
                setIsOpen(true);
                inputRef.current?.focus();
              }
            }}
            className="p-1 text-slate-400 hover:text-slate-600"
          >
            <ChevronDown
              className={[
                "h-4 w-4 shrink-0 transition",
                isOpen ? "rotate-180 text-[#3E9E9E]" : "",
              ].join(" ")}
              strokeWidth={2}
            />
          </button>
        </div>
      </div>

      {isOpen ? (
        <div
          className={[
            "absolute left-0 z-50 max-h-64 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-xl shadow-slate-900/10",
            openDirection === "top" ? "bottom-full mb-2" : "top-full mt-2",
          ].join(" ")}
        >
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              handleSelectOption("", "");
            }}
            className="block w-full px-4 py-2.5 text-left text-sm font-medium text-slate-400 transition hover:bg-cyan-50 hover:text-[#3E9E9E]"
          >
            {placeholder}
          </button>

          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelectOption(option.value, option.label);
                }}
                className={[
                  "block w-full px-4 py-2.5 text-left text-sm font-medium transition hover:bg-cyan-50 hover:text-[#3E9E9E]",
                  selectedValue === option.value
                    ? "bg-cyan-50 font-semibold text-[#3E9E9E]"
                    : "text-slate-700",
                ].join(" ")}
              >
                {option.label}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-center text-xs font-medium text-slate-400">
              Tidak ada pilihan yang cocok
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
