import { BaseGeral } from '@examModule/persistence/entity/base-geral.entity';
import { Injectable } from '@nestjs/common';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class BaseGeralFilterMapper {
  private readonly whitelist = [
    'nomeColaborador',
    'ticket',
    'tipoExame',
    'status',
  ] as const;

  toWhere(filters: Record<string, unknown>): FindOptionsWhere<BaseGeral> {
    const where: FindOptionsWhere<BaseGeral> = {};

    for (const key of this.whitelist) {
      const value = filters[key];

      if (value !== undefined && value !== null && value !== '') {
        where[key] = value as string;
      }
    }

    return where;
  }
}
