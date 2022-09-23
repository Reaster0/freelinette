import { INestApplication } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";
import { Test, TestStep } from '../entities/test.entity';

export class elementDto {
	@IsString()
	@IsNotEmpty()
	 readonly selector: string;
	
	@IsString()
	@IsNotEmpty()
	readonly path: string;
}

export class ParamValueDto {
	@IsString()
	@IsNotEmpty()
	readonly id: string;

	@IsString()
	readonly text: string;
}

export class paramsDto {
	
	@IsOptional()
	@IsString()
	readonly name: string;
	
	@IsOptional()
	@IsString()
	readonly value: string;

	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => ParamValueDto)
	readonly valueExtend: ParamValueDto;
}


export class testDto {

	@IsString()
	@IsNotEmpty()
	readonly action: string;

	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => elementDto)
	readonly element: elementDto;

	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => paramsDto)
	readonly params: paramsDto;
}

export class testBundleDto {
	@IsString()
	@IsNotEmpty()
	readonly name: string;

	@IsString()
	@IsNotEmpty()
	readonly website: string;

	@IsNotEmpty()
	@ValidateNested({ each: true })
	@Type(() => testDto)
	readonly tests: testDto[];
}


export function testDto2TestStep(test: testDto): TestStep {
	const result = new TestStep();
	result.action = test.action;
	result.element = test.element;
	result.params = test.params;
	return result;
}

export function arrayTestDto2Test(tests: testDto[]): TestStep[] {
	return tests.map(test => testDto2TestStep(test));
}

export function testBundleDto2Test(testBundle: testBundleDto): Test {
	const result = new Test();
	result.name = testBundle.name;
	result.website = testBundle.website;
	result.test = arrayTestDto2Test(testBundle.tests);
	return result;
}