import { testDto } from './../dto/test.dto';
import { Injectable } from '@nestjs/common';
import { exec, execSync } from "child_process";
const fs = require('fs');
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
//import { v4 as uuid } from 'uuid';
import { Test } from '../entities/test.entity';

@Injectable()
export class CypressService {
	constructor(
		@InjectRepository(Test)
		private testRepository: Repository<Test>,
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

	storeTest(test: testDto): void {
		const tempy = {
			id: 420,
			...test
		}
		this.testRepository.save(tempy);
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
