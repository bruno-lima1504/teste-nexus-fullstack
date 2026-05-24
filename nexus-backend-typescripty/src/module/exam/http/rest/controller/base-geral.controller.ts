import { BaseGeralService } from '@examModule/core/service/base-geral.service';
import { ListBaseGeralQueryDto } from '@examModule/http/rest/dto/request/list-base-geral-query.dto';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@sharedModule/auth/guard/auth.guard';

@Controller('exam/base-geral')
@UseGuards(AuthGuard)
export class BaseGeralController {
  constructor(private readonly baseGeralService: BaseGeralService) {}

  @Get()
  async list(@Query() query: ListBaseGeralQueryDto) {
    return this.baseGeralService.list(query);
  }
}
