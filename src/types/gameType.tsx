/**
 * Type defnition for Games.
 */
export interface GameType {
  id: number;
  name: string;
  course: string;
  year: number;
  team: Record<string, string>;
  blurb: string;
  thumbnail: string;
  releases: Record<string, string>;
}
  