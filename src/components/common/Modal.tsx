import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/helpers";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  footer?: ReactNode;
  className?: string;
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
};

export const Modal = ({
  open,
  onClose,
  title,
  children,
  size = "md",
  footer,
  className,
}: ModalProps) => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm animate-[fade-in-up_0.2s_ease-out]"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative w-full bg-white rounded-2xl shadow-modal max-h-[90vh] flex flex-col animate-[fade-in-up_0.3s_ease-out]",
          sizeClasses[size],
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 shrink-0">
            <h3 className="font-serif text-xl font-semibold text-neutral-900">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-btn text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 transition"
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
          {children}
        </div>
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-100 shrink-0 bg-neutral-50/50 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
