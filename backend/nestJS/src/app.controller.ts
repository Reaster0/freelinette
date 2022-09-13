import { testDto} from './dto/test.dto';
import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


  @Post('testExec')
  testExec(@Body() testDto: testDto[]): testDto[] {
		return testDto;
	}
}
