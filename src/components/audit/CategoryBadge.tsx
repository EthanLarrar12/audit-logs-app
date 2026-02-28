import {
  Target,
  Database,
  Key,
  FileText,
  Clock,
  Shield,
  HardDrive,
  User as UserIcon,
  Box,
  ShieldAlert,
  Tags,
  Monitor,
  UserCircle,
  Users,
  Settings,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ParameterIcon = ({ className }: { className?: string }) => (
  <svg
    width="26"
    height="21"
    viewBox="0 0 26 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M16.75 6.17857H20.75M16.75 10.25H20.75M16.75 14.3214H20.75M12.75 15.6786C12.342 14.8466 11.506 14.3214 10.5927 14.3214H6.90733C5.994 14.3214 5.158 14.8466 4.75 15.6786M2.08333 0.75H23.4167C23.7703 0.75 24.1094 0.892985 24.3595 1.1475C24.6095 1.40201 24.75 1.74721 24.75 2.10714V18.3929C24.75 18.7528 24.6095 19.098 24.3595 19.3525C24.1094 19.607 23.7703 19.75 23.4167 19.75H2.08333C1.72971 19.75 1.39057 19.607 1.14052 19.3525C0.890476 19.098 0.75 18.7528 0.75 18.3929V2.10714C0.75 1.74721 0.890476 1.40201 1.14052 1.1475C1.39057 0.892985 1.72971 0.75 2.08333 0.75ZM11.4167 7.53571C11.4167 8.25559 11.1357 8.94598 10.6356 9.455C10.1355 9.96403 9.45724 10.25 8.75 10.25C8.04276 10.25 7.36448 9.96403 6.86438 9.455C6.36428 8.94598 6.08333 8.25559 6.08333 7.53571C6.08333 6.81584 6.36428 6.12545 6.86438 5.61642C7.36448 5.1074 8.04276 4.82143 8.75 4.82143C9.45724 4.82143 10.1355 5.1074 10.6356 5.61642C11.1357 6.12545 11.4167 6.81584 11.4167 7.53571Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
import { getCategoryName } from "@/constants/filterOptions";
import { styles } from "./CategoryBadge.styles";

interface CategoryBadgeProps {
  category: string;
  label?: string;
  icon?: React.ElementType;
  className?: string;
  onRemove?: () => void;
}

type StyleKey = keyof typeof styles;

const badgeConfig: Record<
  string,
  { icon: React.ElementType; styleKey: StyleKey; label?: string }
> = {
  // Categories (SCREAMING_SNAKE_CASE)
  USER: {
    icon: UserIcon,
    label: "משתמש",
    styleKey: "User",
  },
  ENTITY: {
    icon: Box,
    label: "ישות",
    styleKey: "Entity",
  },
  SHOS: {
    icon: ShieldAlert,
    label: 'שו"ס',
    styleKey: "Shos",
  },
  DYNAMIC_TAG: {
    icon: Tags,
    label: "תגיות",
    styleKey: "DynamicTag",
  },
  END_SYSTEM: {
    icon: Monitor,
    label: "מערכת קצה",
    styleKey: "EndSystem",
  },
  PROFILE: {
    icon: UserCircle,
    label: "פרופיל",
    styleKey: "Profile",
  },
  DISTRIBUTION_GROUP: {
    icon: Users,
    label: "רשימות תפוצה",
    styleKey: "DistributionGroup",
  },
  SYSTEM: {
    icon: Settings,
    label: "מערכת",
    styleKey: "System",
  },
  PARAMETER: {
    icon: ParameterIcon,
    label: "תכונה",
    styleKey: "DynamicTag", // Reusing a similar style or define a new one if needed
  },
  // Target Types (lowercase)
  user: {
    icon: UserIcon,
    label: "משתמש",
    styleKey: "user",
  },
  account: {
    icon: UserIcon,
    label: "חשבון",
    styleKey: "account",
  },
  storage: {
    icon: HardDrive,
    label: "אחסון",
    styleKey: "storage",
  },
  api_group: {
    icon: Key,
    label: "קבוצת API",
    styleKey: "api_group",
  },
  database: {
    icon: Database,
    label: "מסד נתונים",
    styleKey: "database",
  },
  report: {
    icon: FileText,
    label: "דוח",
    styleKey: "report",
  },
  session: {
    icon: Clock,
    label: "הפעלה",
    styleKey: "session",
  },
  role: {
    icon: Shield,
    label: "תפקיד",
    styleKey: "role",
  },
};

const defaultConfig: {
  icon: React.ElementType;
  styleKey: StyleKey;
  label?: string;
} = {
  icon: Target,
  styleKey: "default",
};

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  label: customLabel,
  icon: CustomIcon,
  className,
  onRemove,
}) => {
  const config = badgeConfig[category] || defaultConfig;
  const label = customLabel || config.label || getCategoryName(category);
  const Icon = CustomIcon || config.icon;

  return (
    <span
      className={cn(
        styles.baseBadge,
        styles[config.styleKey],
        className,
        onRemove && "pr-1 cursor-default",
      )}
    >
      <Icon className={styles.icon} />
      {label}
      {onRemove && (
        <span
          role="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:bg-black/10 rounded-full p-0.5 ml-1 transition-colors cursor-pointer"
        >
          <X className="h-3 w-3" />
        </span>
      )}
    </span>
  );
};
