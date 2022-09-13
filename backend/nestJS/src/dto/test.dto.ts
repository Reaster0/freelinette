import { IsNotEmpty, IsOptional, IsString } from "class-validator";


class elementDto {
	@IsString()
	@IsNotEmpty()
	 readonly selector: string;
	
	@IsString()
	@IsNotEmpty()
	readonly path: string;
}

class ParamValueDto {
	@IsString()
	@IsNotEmpty()
	readonly id: string;

	@IsString()
	readonly text: string;
}

class paramsDto {
	
	@IsOptional()
	readonly name: string;
	
	@IsOptional()
	readonly value: string | ParamValueDto;
	
}


export class testDto {

	@IsString()
	@IsNotEmpty()
	readonly action: string;

	@IsNotEmpty()
	readonly element: elementDto;

	@IsNotEmpty()
	readonly params: paramsDto;
}