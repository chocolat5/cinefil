import { getErrorMessage } from "@/utils/helpers";

const accessToken = import.meta.env.PUBLIC_TMDB_API_ACCESS_TOKEN;
const baseURL = "https://api.themoviedb.org/3";
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${accessToken}`,
  },
};

const getStatusErrorMessage = (status: number): string => {
  if (status === 401) {
    return `Service temporarily unavailable.`;
  }
  if (status === 429) {
    return `Too many requests. Please wait a
  moment.`;
  }
  if (status >= 500) {
    return `Service error. Please try again later.`;
  }
  return `Search failed. Please try again.`;
};

export const getPosterURL = (path: string): string => {
  return `https://image.tmdb.org/t/p/w185${path}`;
};

export const searchMovies = async (params: string) => {
  const url = `${baseURL}/search/movie?include_adult=false&language=en-US&page=1&query=${params}`;

  let response = [];
  let error;
  try {
    const res = await fetch(url, options);

    // check http status
    if (!res.ok) {
      const errorMsg = getStatusErrorMessage(res.status);
      throw new Error(errorMsg);
    }

    const json = await res.json();
    const tempData = json.results;

    // データ整形
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response = tempData.map((res: any) => ({
      ...res,
      posterPath: res.poster_path,
      year: res.release_date
        ? String(new Date(res.release_date as Date).getFullYear())
        : undefined,
    }));
  } catch (err) {
    error = getErrorMessage(err);
  }

  return { data: response, error: error as string };
};

export const searchPeople = async (
  department: "Directing" | "Acting",
  params: string
) => {
  const url = `${baseURL}/search/person?include_adult=false&language=en-US&page=1&query=${params}`;
  const url2 = `${baseURL}/search/person?include_adult=false&language=en-US&page=2&query=${params}`;

  let response = [];
  let error;
  try {
    const [data1, data2] = await Promise.all([
      fetch(url, options)
        .then((res) => {
          // check http status
          if (!res.ok) {
            const errorMsg = getStatusErrorMessage(res.status);
            throw new Error(errorMsg);
          }
          return res.json();
        })
        .then((json) => json.results)
        .then((data) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.filter((d: any) => d.known_for_department === department)
        ),
      fetch(url2, options)
        .then((res) => {
          // check http status
          if (!res.ok) {
            const errorMsg = getStatusErrorMessage(res.status);
            throw new Error(errorMsg);
          }
          return res.json();
        })
        .then((json) => json.results)
        .then((data) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.filter((d: any) => d.known_for_department === department)
        ),
    ]);

    // データ整形
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response = [...data1, ...data2].map((res: any) => ({
      ...res,
      profilePath: res.profile_path,
    }));
  } catch (err) {
    error = getErrorMessage(err);
  }

  return { data: response, error: error as string };
};
