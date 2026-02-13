import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchSuggestions } from "@/lib/api";

export const useSuggestions = (term: string) => {
  return useInfiniteQuery({
    queryKey: ["suggestions", term],
    queryFn: async ({ pageParam = 1 }) => {
      const data = await fetchSuggestions(term, pageParam);
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 50 ? allPages.length + 1 : undefined;
    },
    enabled: term.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
