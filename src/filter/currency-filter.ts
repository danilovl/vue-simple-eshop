export default function currencyFilter(value: any): string {
    return new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(value)
}
