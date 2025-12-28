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
    Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getCategoryName } from '@/constants/filterOptions';

interface CategoryBadgeProps {
    category: string;
    label?: string;
    icon?: React.ElementType;
    className?: string;
}

const badgeConfig: Record<string, { icon: React.ElementType; colorClass: string; label?: string }> = {
    // Categories (PascalCase)
    User: {
        icon: UserIcon,
        colorClass: 'bg-blue-500/15 text-blue-600 border-blue-500/30',
    },
    Entity: {
        icon: Box,
        colorClass: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30',
    },
    Shos: {
        icon: ShieldAlert,
        colorClass: 'bg-rose-500/15 text-rose-600 border-rose-500/30',
    },
    DynamicTag: {
        icon: Tags,
        colorClass: 'bg-purple-500/15 text-purple-600 border-purple-500/30',
    },
    EndSystem: {
        icon: Monitor,
        colorClass: 'bg-amber-500/15 text-amber-600 border-amber-500/30',
    },
    Profile: {
        icon: UserCircle,
        colorClass: 'bg-indigo-500/15 text-indigo-600 border-indigo-500/30',
    },
    DistributionGroup: {
        icon: Users,
        colorClass: 'bg-cyan-500/15 text-cyan-600 border-cyan-500/30',
    },
    // Target Types (lowercase)
    user: {
        icon: UserIcon,
        label: 'משתמש',
        colorClass: 'bg-blue-500/15 text-blue-600 border-blue-500/30',
    },
    account: {
        icon: UserIcon,
        label: 'חשבון',
        colorClass: 'bg-indigo-500/15 text-indigo-600 border-indigo-500/30',
    },
    storage: {
        icon: HardDrive,
        label: 'אחסון',
        colorClass: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30',
    },
    api_group: {
        icon: Key,
        label: 'קבוצת API',
        colorClass: 'bg-amber-500/15 text-amber-600 border-amber-500/30',
    },
    database: {
        icon: Database,
        label: 'מסד נתונים',
        colorClass: 'bg-purple-500/15 text-purple-600 border-purple-500/30',
    },
    report: {
        icon: FileText,
        label: 'דוח',
        colorClass: 'bg-cyan-500/15 text-cyan-600 border-cyan-500/30',
    },
    session: {
        icon: Clock,
        label: 'הפעלה',
        colorClass: 'bg-rose-500/15 text-rose-600 border-rose-500/30',
    },
    role: {
        icon: Shield,
        label: 'תפקיד',
        colorClass: 'bg-orange-500/15 text-orange-600 border-orange-500/30',
    },
};

const defaultConfig: { icon: React.ElementType; colorClass: string; label?: string } = {
    icon: Target,
    colorClass: 'bg-muted text-muted-foreground border-border',
};

export function CategoryBadge({ category, label: customLabel, icon: CustomIcon, className }: CategoryBadgeProps) {
    const config = badgeConfig[category] || defaultConfig;
    const label = customLabel || config.label || getCategoryName(category);
    const Icon = CustomIcon || config.icon;

    return (
        <span
            className={cn(
                'inline-flex items-center gap-2 px-3 py-1 text-xs font-medium uppercase tracking-wider rounded-full border shrink-0 whitespace-nowrap',
                config.colorClass,
                className
            )}
        >
            <Icon className="w-3.5 h-3.5" />
            {label}
        </span>
    );
}
