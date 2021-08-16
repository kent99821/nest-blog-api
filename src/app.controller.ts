import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';



@ApiTags('默认')
@Controller()
export class AppController {

  @Get()
  index(): string {
    return 'index';
  }
}
