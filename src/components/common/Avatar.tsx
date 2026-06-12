import { cn, getAvatarColor, getAvatarInitials } from "@/utils/helpers";

interface AvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  badge?: React.ReactNode;
}

const sizeMap = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-lg",
  xl: "w-20 h-20 text-2xl",
};

export const Avatar = ({
  src,
  name,
  size = "md",
  className,
  badge,
}: AvatarProps) => {
  const initials = getAvatarInitials(name);
  const colorClass = getAvatarColor(name);

  return (
    <div className={cn("relative inline-flex shrink-0", className)}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={cn(
            "rounded-full object-cover ring-2 ring-white shadow-sm",
            sizeMap[size]
          )}
        />
      ) : (
        <div
          className={cn(
            "rounded-full bg-gradient-to-br flex items-center justify-center font-semibold text-white ring-2 ring-white shadow-sm",
            colorClass,
            sizeMap[size]
          )}
        >
          {initials}
        </div>
      )}
      {badge && (
        <div className="absolute -bottom-0.5 -right-0.5 translate-x-1/4 translate-y-1/4">
          {badge}
        </div>
      )}
    </div>
  );
};
