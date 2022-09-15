import { testDto } from './dto/test.dto';
import { Injectable } from '@nestjs/common';
import { exec, execSync } from "child_process";
const fs = require('fs');
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test } from './entities/test.entity';

@Injectable()
export class CypressService {
	constructor(
		@InjectModel(Test.name) private readonly testModel: Model<Test>,
	) {} 

	async testOutput(): Promise<string> {
		let result: string;
		try {
		result = fs.readFileSync('../cypress-runtime/output.txt', 'utf8');
		} catch (e) {
			result = "error reading result file";
			console.log(e)
		}
		return result;
	}

	findAll() {
		return this.testModel.find().exec();
	}

	findOne(id: string) {
		const test = this.testModel.findOne({ id: id }).exec();
		return test;
	}

	createNewTest(test: testDto) {
		const newTest = new this.testModel(test);
		newTest.save();
	}
	

	launchTest(): void {
	// 	exec('pwd;', { cwd: "../cypress-runtime"},  ((error, stdout, stderr) => {
	// 		if (error) {
	// 			return (`error: ${error.message}`);
	// 		}
	// 		if (stderr) {
	// 			return (`stderr: ${stderr}`);
	// 		}
	// 		return (`stdout: ${stdout}`);
	// 	}));


		try{
			console.log("the test has started")
			execSync('./node_modules/.bin/cypress run --browser chrome > output.txt', { cwd: "../cypress-runtime"});
			console.log("test success")
		} catch (e) {
			console.log("the test failed")
		}
	}
}