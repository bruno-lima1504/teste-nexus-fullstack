import { BaseGeralFilterMapper } from '@examModule/core/util/base-geral-filter.mapper';
import { ListBaseGeralQueryDto } from '@examModule/http/rest/dto/request/list-base-geral-query.dto';
import { BaseGeralRepository } from '@examModule/persistence/repository/base-geral.repository';
import { Injectable } from '@nestjs/common';
import { PaginatedResult } from '@sharedModule/persistence/typeorm/type/pagination.type';
import { BaseGeral } from '@examModule/persistence/entity/base-geral.entity';

@Injectable()
export class BaseGeralService {
  constructor(
    private readonly baseGeralRepository: BaseGeralRepository,
    private readonly filterMapper: BaseGeralFilterMapper,
  ) {}

  async list(
    query: ListBaseGeralQueryDto,
  ): Promise<PaginatedResult<BaseGeral>> {
    const where = this.filterMapper.toWhere({
      nomeColaborador: query.nomeColaborador,
      ticket: query.ticket,
      tipoExame: query.tipoExame,
      status: query.status,
    });

    return this.baseGeralRepository.findPaginated({
      where,
      page: query.page,
      limit: query.limit,
    });
  }
}
