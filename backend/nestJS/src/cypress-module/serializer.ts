import { testDto, elementDto, paramsDto, ParamValueDto } from './dto/test.dto';

export function srlInit(name: string, website: string): string {
	//temp for testing
	console.log("website ==", website);
	if (website === "http://127.0.0.1:5501/demo-form.html")
		website = "http://172.17.0.1:5501/demo-form.html"
	//temp for testing

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
	result += srlAction(test.action, test.params);
	result += srlParams(test.params);
	result += "\n";

	return result;
}

function srlTarget(target: elementDto): string {
	return `\t\tcy.get('${target.path}')`;
}

function srlAction(action: string, params: paramsDto): string {
	let result = "";
	if (action === "Click" && params.name != "Select")
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
	else if (params.name === "Contain")
		result = `.should('contain', '${params.value}')`;
	else if (params.name === "Select")
		result = `.select('${params.valueExtend.text}', ${params.valueExtend.id})`;
	return result;
}