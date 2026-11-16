/// <reference types="vite/client" />

import type currencyFilter from '@/filter/currency-filter'
import type transFilter from '@/filter/trans-filter'
import type truncateFilter from '@/filter/truncate-filter'

declare global {
    interface ImportMetaEnv {
        readonly VITE_API_URL?: string
    }
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $filters: {
            currencyFilter: typeof currencyFilter
            transFilter: typeof transFilter
            truncateFilter: typeof truncateFilter
        }
        $version: () => void
    }
}

declare module 'vue-router' {
    interface RouteMeta {
        display?: boolean
        title?: string
        metaTags?: Record<string, string>[]
        requiresAuth?: boolean
    }
}

export {}
