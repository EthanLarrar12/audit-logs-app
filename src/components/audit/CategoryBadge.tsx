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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getCategoryName } from "@/constants/filterOptions";
import { styles } from "./CategoryBadge.styles";

interface CategoryBadgeProps {
  category: string;
  label?: string;
  icon?: React.ElementType;
  className?: string;
}

type StyleKey = keyof typeof styles;

const badgeConfig: Record<
  string,
  { icon: React.ElementType; styleKey: StyleKey; label?: string }
> = {
  // Categories (SCREAMING_SNAKE_CASE)
  USER: {
    icon: UserIcon,
    styleKey: "User",
  },
  ENTITY: {
    icon: Box,
    styleKey: "Entity",
  },
  SHOS: {
    icon: ShieldAlert,
    styleKey: "Shos",
  },
  DYNAMIC_TAG: {
    icon: Tags,
    styleKey: "DynamicTag",
  },
  END_SYSTEM: {
    icon: Monitor,
    styleKey: "EndSystem",
  },
  PROFILE: {
    icon: UserCircle,
    styleKey: "Profile",
  },
  DISTRIBUTION_GROUP: {
    icon: Users,
    styleKey: "DistributionGroup",
  },
  SYSTEM: {
    icon: Settings,
    styleKey: "System",
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
}) => {
  const config = badgeConfig[category] || defaultConfig;
  const label = customLabel || config.label || getCategoryName(category);
  const Icon = CustomIcon || config.icon;

  return (
    <span className={cn(styles.baseBadge, styles[config.styleKey], className)}>
      <Icon className={styles.icon} />
      {label}
    </span>
  );
};
