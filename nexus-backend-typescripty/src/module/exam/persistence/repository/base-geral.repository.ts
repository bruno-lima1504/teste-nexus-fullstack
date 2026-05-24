import { BaseGeral } from '@examModule/persistence/entity/base-geral.entity';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ReadOnlyTypeOrmRepository } from '@sharedModule/persistence/typeorm/repository/read-only-typeorm.repository';
import { DataSource } from 'typeorm';

@Injectable()
export class BaseGeralRepository extends ReadOnlyTypeOrmRepository<BaseGeral> {
  constructor(
    @InjectDataSource('exam')
    dataSource: DataSource,
  ) {
    super(BaseGeral, dataSource.manager);
  }

  async findOneById(id: number): Promise<BaseGeral | null> {
    return this.findOne({
      where: { id },
    });
  }

  async findOneByTicket(ticket: string): Promise<BaseGeral | null> {
    return this.findOne({
      where: { ticket },
    });
  }
}
