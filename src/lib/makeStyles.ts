/**
 * A simple utility to organize Tailwind CSS classes.
 * Returns the object passed to it, providing a typed structure for Styles.
 */
export const makeStyles = <T extends Record<string, string>>(styles: T): T => styles;
