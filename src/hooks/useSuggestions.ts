import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchSuggestions } from "@/lib/api";
import { useDebounce } from "./useDebounce";

export const useSuggestions = (term: string) => {
  const debouncedTerm = useDebounce(term, 500);

  return useInfiniteQuery({
    queryKey: ["suggestions", debouncedTerm],
    queryFn: async ({ pageParam = 1 }) => {
      const data = await fetchSuggestions(debouncedTerm, pageParam);
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 50 ? allPages.length + 1 : undefined;
    },
    enabled: debouncedTerm.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: keepPreviousData,
  });
};
