/**
 * Type defnition for Games.
 */
export interface GameType {
  id: number;
  name: string;
  course: string;
  year: number;
  blurb: string;
  thumbnail: string;
  releases: { steam?: string };
}
  