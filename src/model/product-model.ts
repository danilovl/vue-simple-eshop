export type ProductId = string | number

export class ProductModel {
    constructor(
        public readonly id: ProductId | null,
        public title: string,
        public description: string,
        public price: number,
        public rating: number,
        public ratingCount: number,
        public image: string
    ) {}

    static fromApi(data: any): ProductModel {
        return new ProductModel(
            data?.id ?? null,
            String(data?.title ?? ''),
            String(data?.description ?? ''),
            Number(data?.price ?? 0),
            Number(data?.rating ?? 0),
            Number(data?.ratingCount ?? 0),
            String(data?.image ?? '')
        )
    }
}
