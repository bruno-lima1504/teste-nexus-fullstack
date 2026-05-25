import {
  EntityManager,
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import {
  PaginatedResult,
  PaginationOptions,
} from '@sharedModule/persistence/typeorm/type/pagination.type';

export abstract class ReadOnlyTypeOrmRepository<T extends ObjectLiteral> {
  private repository: Repository<T>;

  constructor(
    readonly entity: EntityTarget<T>,
    readonly entityManager: EntityManager,
  ) {
    this.repository = entityManager.getRepository(entity);
  }

  async find(options: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async findOne(options: FindOneOptions<T>): Promise<T | null> {
    return this.repository.findOne(options);
  }

  async findPaginated(
    options: {
      where?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
      order?: FindOptionsOrder<T>;
    } & PaginationOptions,
  ): Promise<PaginatedResult<T>> {
    const page = options.page ?? 1;
    const limit = options.limit ?? 10;
    const skip = (page - 1) * limit;

    const [data, total] = await this.repository.findAndCount({
      where: options.where,
      order: options.order,
      skip,
      take: limit,
    });

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 0,
      },
    };
  }
}
