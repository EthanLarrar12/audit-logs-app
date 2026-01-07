/**
 * Centralized theme tokens for the application.
 * These tokens map to Tailwind CSS classes but provide a semantic naming layer.
 */
export const theme = {
    colors: {
        // Text colors
        textPrimary: 'text-foreground',
        textSecondary: 'text-muted-foreground',
        textInverse: 'text-primary-foreground',
        textBrand: 'text-primary',
        textDestructive: 'text-destructive-foreground',
        textSuccess: 'text-success-foreground',

        // Backgrounds
        bgPrimary: 'bg-background',
        bgSecondary: 'bg-muted',
        bgCard: 'bg-card',
        bgAccent: 'bg-accent',
        bgBrand: 'bg-primary',

        // Interactive
        hover: 'hover:bg-table-row-hover',
        transition: 'transition-all duration-200',

        // Status/Semantic
        border: 'border-border',
        ring: 'ring-primary/20',

        // Badges
        badgeUser: 'bg-badge-user/15 text-badge-user border-badge-user/30',
        badgeSystem: 'bg-badge-system/15 text-badge-system border-badge-system/30',
        badgeService: 'bg-badge-service/15 text-badge-service border-badge-service/30',

        // Category Specific Colors
        blue: 'bg-blue-500/15 text-blue-600 border-blue-500/30',
        emerald: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30',
        rose: 'bg-rose-500/15 text-rose-600 border-rose-500/30',
        purple: 'bg-purple-500/15 text-purple-600 border-purple-500/30',
        amber: 'bg-amber-500/15 text-amber-600 border-amber-500/30',
        indigo: 'bg-indigo-500/15 text-indigo-600 border-indigo-500/30',
        cyan: 'bg-cyan-500/15 text-cyan-600 border-cyan-500/30',
        orange: 'bg-orange-500/15 text-orange-600 border-orange-500/30',
    },

    typography: {
        // Families
        sans: 'font-sans',
        mono: 'font-mono',

        // Sizes
        xs: 'text-xs',
        sm: 'text-sm',
        base: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl',
        h1: 'text-2xl',

        // Weights
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
    },

    layouts: {
        page: 'min-h-screen bg-background p-6',
        container: 'max-w-7xl mx-auto space-y-6',
        card: 'rounded-lg border bg-card shadow-sm',
    }
} as const;

export type Theme = typeof theme;
