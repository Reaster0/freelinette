import { Injectable } from '@nestjs/common';
import { exec, execSync } from "child_process";
import fs from "fs";
//import { waitForDebugger } from 'inspector';

@Injectable()
export class CypressService {
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


	// try{
	// 	console.log("the test has started")
	// 	execSync('./node_modules/.bin/cypress run --browser chrome > output.txt', { cwd: "../cypress-runtime"});
	// 	console.log("test success")
	// } catch (e) {
	// 	console.log("the test failed")
	// }

	fs.readFile('main.ts', 'utf8', function(err, data) {
		if (err) throw err;
		console.log(data);
	});
		
	}
}
