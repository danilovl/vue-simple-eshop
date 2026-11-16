import type {ProductModel} from '@/model/product-model'

export type ProductsState = {
    currentPage: number;
    pageSize: number;
    totalVisible: number;
    pages: Record<number, ProductModel[]>;
    serverPageCount: number;
    searchTerm: string;
    totalCount: number;
}
