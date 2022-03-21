const { spawn } = require('child_process');
const { resolve } = require('path');

module.exports = function(buffer) {
	return this.data.git.then(std => {
		const lines = std.trim().split('\n').map(e => e.trim());
		return `${buffer}
export const created = ${lines.length > 0 ? JSON.stringify(lines[lines.length - 1]) : 'null'}
export const updated = ${lines.length > 0 ? JSON.stringify(lines[0]) : 'null'}
`;
	})
}
module.exports.pitch = function (remainingRequest, precedingRequest, data) {
	data.git = new Promise((resolve, reject) => {
		const child = spawn('git', ['log', '--format=%aD', '--follow', '--', this.resource], { stdio: ['ignore', 'pipe', process.stderr], windowsHide: true });
		let stdout = '';
		child.stdout.on('data', (data) => {
			stdout += data;
		});
		child.on('close', (code) => {
			if (code !== 0) {
				reject(new Error('Subprocess exited with an error!'));
			} else { 
				resolve(stdout);
			}
		});
	})
}
