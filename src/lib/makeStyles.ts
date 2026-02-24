import { theme, Theme } from './theme';

/**
 * A simple utility to organize Tailwind CSS classes.
 * Can be a style object or a function that receives the theme.
 */
export const makeStyles = <T extends Record<string, any>>(
    styles: T | ((t: Theme) => T)
): T => {
    return typeof styles === 'function' ? styles(theme) : styles;
};
