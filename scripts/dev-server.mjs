import { spawn } from 'node:child_process';

const args = process.argv.slice(2);
const valueAfter = (flag, fallback) => {
  const index = args.indexOf(flag);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
};

const hostname = valueAfter('--host', valueAfter('--hostname', '0.0.0.0'));
const port = valueAfter('--port', '3000');
const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', '--hostname', hostname, '--port', port], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});
