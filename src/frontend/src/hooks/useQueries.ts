import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useGetAllCommands() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["commands"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCommands();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

export function useAddCommand() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (command: string) => {
      if (!actor) throw new Error("No actor");
      return actor.addCommand(command);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["commands"] }),
  });
}

export function useGetControlState() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["controlState"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCurrentState();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateControlState() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (state: {
      brightness: number;
      volume: number;
      wifiOn: boolean;
      dndOn: boolean;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateControlState(
        state.brightness,
        state.volume,
        state.wifiOn,
        state.dndOn,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["controlState"] }),
  });
}

export function useGetReviews() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllReviews();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddReview() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (review: {
      name: string;
      location: string;
      rating: number;
      reviewText: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.addReview(
        review.name,
        review.location,
        review.rating,
        review.reviewText,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reviews"] }),
  });
}
