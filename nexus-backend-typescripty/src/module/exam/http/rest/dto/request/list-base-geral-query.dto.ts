import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ListBaseGeralQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @IsOptional()
  @IsString()
  nomeColaborador?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  ticket?: number;

  @IsOptional()
  @IsString()
  tipoExame?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
