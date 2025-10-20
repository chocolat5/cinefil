import { MOVIE_GENRES } from "@/config/genres";

export const getGenreName = (id: number) => {
  const genre = MOVIE_GENRES.find((genre) => genre.id === id);
  return genre?.name || "Unknown";
};
