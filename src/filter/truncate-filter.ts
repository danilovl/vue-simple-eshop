export default function truncateFilter(value: string, limit = 150): string {
    if (value.length > limit) {
        value = value.substring(0, (limit - 3)) + '...'
    }

    return value
}
