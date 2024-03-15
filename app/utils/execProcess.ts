import { execFile } from 'child_process';

function execProcess(file: string, args?: readonly string[] | null) {
	return new Promise<string>((resolve, reject) => {
		const child = execFile(file, args);
		let output = '';

		child.stdout?.on('data', (data) => {
			output += data.toString();
		});

		child.on('close', (code) => {
			if (code !== 0) {
				reject(new Error(`Process exited with code ${code}`));
				return;
			}
			resolve(output);
		});

		child.on('error', (error) => {
			reject(error);
		});
	});
}
export default execProcess;
