import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface QuestionResult {
    id: bigint;
    userAnswerIndex: bigint;
    isCorrect: boolean;
    questionText: string;
    correctAnswerIndex: bigint;
    options: Array<string>;
    points: bigint;
}
export type Time = bigint;
export interface Reward {
    id: bigint;
    value?: bigint;
    cost: bigint;
    name: string;
    createdAt: Time;
    description: string;
    rewardType: string;
}
export interface Task {
    id: bigint;
    title: string;
    difficulty: bigint;
    createdAt: Time;
    description: string;
    taskType: string;
    questions: Array<Question>;
    pointsReward: bigint;
}
export interface ControlState {
    wifiOn: boolean;
    volume: number;
    brightness: number;
    dndOn: boolean;
}
export interface Question {
    questionText: string;
    correctAnswerIndex: bigint;
    options: Array<string>;
    points: bigint;
}
export interface VoiceCommand {
    command: string;
    timestamp: Time;
}
export type SubscriptionStatus = {
    __kind__: "active";
    active: {
        expiryDateNanos: Time;
    };
} | {
    __kind__: "inactive";
    inactive: null;
};
export interface UserProfile {
    age: bigint;
    name: string;
    streakDays: bigint;
    subscriptionStatus: SubscriptionStatus;
    totalCreditPoints: bigint;
    registrationDate: Time;
    profilePicture?: string;
}
export interface Review {
    id: bigint;
    username: string;
    comment: string;
    timestamp: Time;
    rating: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCommand(command: string): Promise<void>;
    addReview(username: string, rating: bigint, comment: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    calculateTotalPoints(userId: Principal): Promise<bigint>;
    createProfile(name: string, age: bigint, profilePicture: string | null): Promise<{
        streakDays: bigint;
        totalCreditPoints: bigint;
    }>;
    createReward(name: string, description: string, cost: bigint, rewardType: string, value: bigint | null): Promise<Reward>;
    createTask(title: string, description: string, taskType: string, pointsReward: bigint, difficulty: bigint, questions: Array<Question>): Promise<Task>;
    getAllCommands(): Promise<Array<VoiceCommand>>;
    getAllReviews(): Promise<Array<Review>>;
    getAllTasks(): Promise<Array<Task>>;
    getAllVoiceCommands(): Promise<Array<VoiceCommand>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCreditPoints(): Promise<bigint>;
    getCurrentControlState(): Promise<ControlState | null>;
    getCurrentState(): Promise<ControlState | null>;
    getLeaderboard(): Promise<Array<UserProfile>>;
    getProfile(userId: Principal): Promise<{
        age: bigint;
        name: string;
        streakDays: bigint;
        subscriptionStatus: SubscriptionStatus;
        totalCreditPoints: bigint;
        profilePicture?: string;
    } | null>;
    getRewardsStore(): Promise<Array<Reward>>;
    getTopRatedReviews(): Promise<Array<Review>>;
    getTopWinners(): Promise<Array<UserProfile>>;
    getTxAmount(_to: Principal): Promise<bigint>;
    isCallerAdmin(): Promise<boolean>;
    isUserSubscribed(userId: Principal): Promise<boolean>;
    logAiTherapySession(notes: string): Promise<bigint>;
    redeemPoints(rewardId: bigint, cost: bigint): Promise<boolean>;
    redeemReward(rewardId: bigint): Promise<boolean>;
    redeemSubscription(rewardId: bigint): Promise<boolean>;
    earnCredits(points: bigint): Promise<bigint>;
    submitTaskAnswers(taskId: bigint, answers: Array<bigint>): Promise<{
        allCorrect: boolean;
        questionResults: Array<QuestionResult>;
        taskType: string;
        isTaskCompleted: boolean;
        totalPointsForUser: bigint;
        updatedCreditPoints: bigint;
    }>;
    updateControlState(brightness: number, volume: number, wifiOn: boolean, dndOn: boolean): Promise<void>;
}
