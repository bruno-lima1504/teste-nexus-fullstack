import { BaseGeral } from '@examModule/persistence/entity/base-geral.entity';
import { Injectable } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';

type BaseGeralFilters = {
  nomeColaborador?: string;
  ticket?: number;
  tipoExame?: string;
  status?: string;
};

@Injectable()
export class BaseGeralFilterMapper {
  toWhere(filters: BaseGeralFilters): FindOptionsWhere<BaseGeral> {
    const where: FindOptionsWhere<BaseGeral> = {};

    if (filters.nomeColaborador) {
      where.nomeColaborador = filters.nomeColaborador;
    }

    if (filters.ticket !== undefined) {
      where.ticket = filters.ticket;
    }

    if (filters.tipoExame) {
      where.tipoExame = filters.tipoExame;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    return where;
  }
}
