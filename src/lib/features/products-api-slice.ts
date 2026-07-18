import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { Product, Category } from "@/types/product"

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Likes"],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], { category?: string; q?: string } | void>({
      query: (params) => {
        const sp = new URLSearchParams()
        if (params && params.category && params.category !== "all") {
          sp.set("category", params.category)
        }
        if (params && params.q) {
          sp.set("q", params.q)
        }
        const qs = sp.toString()
        return qs ? `/products?${qs}` : "/products"
      },
    }),
    getProduct: builder.query<Product | undefined, string>({
      query: (id) => `/products/${encodeURIComponent(id)}`,
      transformResponse: (response: Product | null) => response ?? undefined,
    }),
    getCategories: builder.query<{ id: Category; label: string }[], void>({
      query: () => "/categories",
    }),
    getLikedIds: builder.query<string[], void>({
      query: () => {
        const token = localStorage.getItem("token")
        return {
          url: "/likes",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      },
      providesTags: ["Likes"],
    }),
    toggleLike: builder.mutation<{ liked: boolean }, string>({
      query: (productId) => {
        const token = localStorage.getItem("token")
        return {
          url: "/likes",
          method: "POST",
          body: { productId },
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      },
      invalidatesTags: ["Likes"],
    }),
  }),
})

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetCategoriesQuery,
  useGetLikedIdsQuery,
  useToggleLikeMutation,
} = productsApi
