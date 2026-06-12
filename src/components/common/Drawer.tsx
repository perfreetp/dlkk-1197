import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/helpers";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  side?: "right" | "left";
  width?: string;
  header?: ReactNode;
}

export const Drawer = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  side = "right",
  width = "w-[480px]",
  header,
}: DrawerProps) => {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const sideClasses =
    side === "right"
      ? `right-0 ${open ? "animate-[slide-in-right_0.3s_ease-out]" : ""}`
      : `left-0 ${open ? "animate-[slide-in-right_0.3s_ease-out_reverse]" : ""}`;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-[2px] animate-[fade-in-up_0.2s_ease-out]"
        onClick={onClose}
      />
      <div
        className={cn(
          "absolute top-0 h-full bg-white shadow-2xl flex flex-col",
          width,
          sideClasses
        )}
      >
        {header ? (
          header
        ) : (
          <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 shrink-0">
            <div>
              {title && (
                <h3 className="font-serif text-lg font-semibold text-neutral-900">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-neutral-500 mt-0.5">{subtitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-btn text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition"
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {children}
        </div>
      </div>
    </div>
  );
};
