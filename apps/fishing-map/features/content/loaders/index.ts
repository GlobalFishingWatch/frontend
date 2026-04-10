import { getAllDatasetIds, getDatasetById } from 'features/content/loaders/datasets'
import {
  getAllUserGuideSections,
  getUserGuideSectionById,
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
  userGuide: { getUserGuideSectionById, getAllUserGuideSections },
  datasets: { getDatasetById, getAllDatasetIds },
}
