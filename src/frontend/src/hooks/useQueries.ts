import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Question } from "../backend.d";
import { useActor } from "./useActor";

export function useGetProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
    retry: 1,
  });
}

export function useCreateProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      age,
      pic,
    }: { name: string; age: number; pic: string | null }) => {
      if (!actor) throw new Error("No actor");
      return actor.createProfile(name, BigInt(age), pic);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });
}

export function useGetCreditPoints() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["credits"],
    queryFn: async () => {
      if (!actor) return 0n;
      return actor.getCreditPoints();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllTasks() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTasks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateTask() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      title: string;
      description: string;
      taskType: string;
      pointsReward: number;
      difficulty: number;
      questions: Question[];
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.createTask(
        args.title,
        args.description,
        args.taskType,
        BigInt(args.pointsReward),
        BigInt(args.difficulty),
        args.questions,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });
}

export function useSubmitTaskAnswers() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      taskId,
      answers,
    }: { taskId: bigint; answers: bigint[] }) => {
      if (!actor) throw new Error("No actor");
      return actor.submitTaskAnswers(taskId, answers);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["credits"] });
      qc.invalidateQueries({ queryKey: ["profile"] });
      qc.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });
}

export function useGetLeaderboard() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeaderboard();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllReviews() {
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
    mutationFn: async ({
      username,
      rating,
      comment,
    }: { username: string; rating: number; comment: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.addReview(username, BigInt(rating), comment);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reviews"] }),
  });
}

export function useGetRewardsStore() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["rewards"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRewardsStore();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateReward() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (args: {
      name: string;
      description: string;
      cost: number;
      rewardType: string;
      value: number | null;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.createReward(
        args.name,
        args.description,
        BigInt(args.cost),
        args.rewardType,
        args.value != null ? BigInt(args.value) : null,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rewards"] }),
  });
}

export function useRedeemReward() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (rewardId: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.redeemReward(rewardId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["credits"] });
      qc.invalidateQueries({ queryKey: ["rewards"] });
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useRedeemSubscription() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (rewardId: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.redeemSubscription(rewardId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["credits"] });
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useLogAiSession() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (notes: string) => {
      if (!actor) throw new Error("No actor");
      return actor.logAiTherapySession(notes);
    },
  });
}
