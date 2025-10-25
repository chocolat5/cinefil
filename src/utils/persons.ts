import type { FavoritePerson } from "@/types/types";
import { getFavoriteActorsApi, getFavoriteDirectorsApi } from "@/utils/api";

export const getDirectors = async (userId: string) => {
  const res = await getFavoriteDirectorsApi(userId);
  return res.directors as FavoritePerson[];
};

export const getActors = async (userId: string) => {
  const res = await getFavoriteActorsApi(userId);
  return res.actors as FavoritePerson[];
};
