export interface IBaseRepository<T> {
    findAll: () => Promise<T[]>;
    findOne: (id: number) => Promise<T>;
}
