import { testDto, elementDto, paramsDto, ParamValueDto } from './dto/test.dto';

export function srlInit(name: string, website: string): string {
	return `
describe('Cypress test', function() {
	it('${name}', function() {
		cy.visit('${website}');

`;
}

export function srlEnd(): string {
	return `
	});
});`;
}

export function srlNewStep(test: testDto): string {
	let result = "";
	result += srlTarget(test.element);
	result += srlAction(test.action);
	result += srlParams(test.params);
	result += "\n";

	return result;
}

function srlTarget(target: elementDto): string {
	return `\t\tcy.get('${target.path}')`;
}

function srlAction(action: string): string {
	let result = "";
	if (action === "Click")
		result = ".click";
	else if (action === "Fill")
		result = `.type`;
	else if (action === "Look")
		result = "";
	return result;
}

function srlParams(params: paramsDto): string {
	let result = "()";
	if (params.name === "Type")
		result = `("${params.value}")`;
	else if (params.name === "Exist")
		result = "";
	else if (params.name === "contain")
		result = `.should('contain', '${params.value}')`;
	
	return result;
}