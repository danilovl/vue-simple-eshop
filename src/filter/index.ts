import type {App} from 'vue'
import currencyFilter from '@/filter/currency-filter'
import transFilter from '@/filter/trans-filter'
import truncateFilter from '@/filter/truncate-filter'

export default function addFilters(app: App): void {
    app.config.globalProperties.$filters = {
        currencyFilter,
        transFilter,
        truncateFilter
    }
}
