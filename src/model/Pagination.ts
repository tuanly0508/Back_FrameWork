export interface Pagination {
    size: number,
    page: number,
    search?: string,
    field?: string,
    sort?: string
}