declare module 'itemsjs' {
  type Item = Record<string, unknown>

  type SearchOptions = {
    query?: string
    per_page?: number
    page?: number
    sort?: string
    filters?: Record<string, string[]>
    filter?: (item: Item) => boolean
  }

  type SearchResult = {
    data: {
      items: Item[]
      aggregations?: Record<
        string,
        {
          buckets: { key: string | number; doc_count: number; selected?: boolean }[]
        }
      >
    }
  }

  type Engine = {
    search: (opts?: SearchOptions) => SearchResult
  }

  function itemsjs(data: Item[], configuration: Record<string, unknown>): Engine
  export default itemsjs
}
