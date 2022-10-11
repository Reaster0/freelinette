import { Get, Controller } from '@nestjs/common';
@Controller()
export class AppController {

	//a simple ping
	@Get()
	test() {
		return 'test';
	}
}
