import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ControlState {
    wifiOn: boolean;
    volume: number;
    brightness: number;
    dndOn: boolean;
}
export type Time = bigint;
export interface VoiceCommand {
    command: string;
    timestamp: Time;
}
export interface Review {
    name: string;
    reviewText: string;
    timestamp: Time;
    rating: number;
    location: string;
}
export interface backendInterface {
    addCommand(command: string): Promise<void>;
    addReview(name: string, location: string, rating: number, reviewText: string): Promise<void>;
    getAllCommands(): Promise<Array<VoiceCommand>>;
    getAllReviews(): Promise<Array<Review>>;
    getCurrentState(): Promise<ControlState | null>;
    updateControlState(brightness: number, volume: number, wifiOn: boolean, dndOn: boolean): Promise<void>;
}
