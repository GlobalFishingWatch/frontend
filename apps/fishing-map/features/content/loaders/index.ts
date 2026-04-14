import {
  getAll as getAllDatasets,
  getById as getByIdDatasets,
} from 'features/content/loaders/datasets'
import {
  getAll as getAllUserGuide,
  getById as getByIdUserGuide,
} from 'features/content/loaders/userGuide'

/**
 * Strapi API - Server functions for fetching data from Strapi
 *
 * Usage in route loaders:
 * ```ts
 * import { strapiApi } from "@/data/loaders";
 *
 * export const Route = createFileRoute("/articles")({
 *   loader: async () => {
 *     const { data, meta } = await strapiApi.articles.getArticlesData();
 *     return data;
 *   },
 * });
 * ```
 */
export const strapiApi = {
  userGuide: { getById: getByIdUserGuide, getAll: getAllUserGuide },
  datasets: { getById: getByIdDatasets, getAll: getAllDatasets },
}
