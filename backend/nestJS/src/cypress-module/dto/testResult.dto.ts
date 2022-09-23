import { IsString, IsNotEmpty } from 'class-validator';

export class testResultDto {
	@IsString()
	@IsNotEmpty()
	readonly startedAt: string;

	@IsString()
	@IsNotEmpty()
	readonly endedAt: string;

	@IsString()
	@IsNotEmpty()
	readonly totalDuration: string;

	//not usefull for now but maybe in the future
	@IsString()
	@IsNotEmpty()
	readonly totalTests: string;

	@IsString()
	@IsNotEmpty()
	readonly totalPassed: string;

	@IsString()
	@IsNotEmpty()
	readonly totalFailed: string;
}