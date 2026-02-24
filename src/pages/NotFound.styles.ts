import { makeStyles } from "@/lib/makeStyles";

export const styles = makeStyles((t) => ({
    container: "flex min-h-screen items-center justify-center bg-muted",
    content: "text-center",
    title: "mb-4 text-4xl font-bold",
    text: "mb-4 text-xl text-muted-foreground",
    link: "text-primary underline hover:text-primary/90",
}));
