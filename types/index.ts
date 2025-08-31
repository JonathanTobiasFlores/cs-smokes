// src/types/index.ts
export type UtilityType = 'smoke' | 'flash' | 'molotov' | 'grenade';
export type TeamSide = 'T' | 'CT' | 'both';
export type ThrowType = 'normal' | 'jump' | 'run' | 'walk';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface CSMap {
  id: string;
  name: string;
  displayName: string;
  image: any; // Can be string (URL) or require() result (number)
  active: boolean;
  competitivePool: boolean;
}

export interface Position {
  x: number;
  y: number;
  callout?: string;
}

export interface Lineup {
  id: string;
  mapId: string;
  name: string;
  description: string;
  type: UtilityType;
  side: TeamSide;
  throwType: ThrowType;
  difficulty: Difficulty;
  startPosition: Position;
  endPosition: Position;
  videoUrl?: string;
  gifUrl?: string;
  thumbnailUrl: string;
  tags: string[];
  isPro?: boolean;
  views?: number;
  isFavorite?: boolean;
}

export type RootStackParamList = {
  Home: undefined;
  MapDetail: { mapId: string; mapName: string };
  LineupDetail: { lineup: Lineup };
};