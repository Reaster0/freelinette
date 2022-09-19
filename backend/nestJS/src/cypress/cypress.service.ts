import { testDto } from './dto/test.dto';
import { Injectable } from '@nestjs/common';
import { exec, execSync, spawn, fork } from "child_process";
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

	createNewTest(testo: testDto[]) {
		const mdr = {
			name: "test ID",
			test: testo
		}
		console.log("mdr =" , mdr)
		const newTest = new this.testModel(mdr);
		newTest.save();
	}
	

	launchTest(): void {

		exec('./exec.sh', { cwd: "../cypress-runtime"},  ((error, stdout, stderr) => {
			if (error) {
				console.log(`error: ${error.message}`);
			}
			if (stderr) {
				console.log(`stderr: ${stderr}`);
			}
			console.log(`stdout: ${stdout}`);
		}));


		// try{
		// 	console.log("the test has started")
		// 	execSync('export CYPRESS_CACHE_FOLDER=/cypress/.cache; ./node_modules/.bin/cypress run 2>&1 > output.txt', { cwd: "../cypress-runtime"});
		// 	console.log("test success")
		// } catch (e) {
		// 	console.log(e)
		// }
	}
}
