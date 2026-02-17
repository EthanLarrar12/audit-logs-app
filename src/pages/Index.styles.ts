import { makeStyles } from "@/lib/makeStyles";

export const styles = makeStyles((t) => ({
  page: 'h-screen w-full overflow-hidden flex flex-col bg-background',
  container: 'h-full w-full flex flex-col py-4 px-[5vw] gap-4',
  tableWrapper: `${t.layouts.card} p-4 flex-1 flex flex-col overflow-hidden min-h-0`,
}));
