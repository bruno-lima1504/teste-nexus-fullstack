import { spawn } from 'node:child_process';

function checkPostgres() {
  const dockerProcess = spawn('docker', [
    'exec',
    'nexus-db',
    'pg_isready',
    '--host',
    'localhost',
  ]);

  let stdout = '';

  dockerProcess.stdout.on('data', (data) => {
    stdout += data.toString();
  });

  dockerProcess.on('close', (code) => {
    console.log(stdout);
    if (stdout.includes('accepting connections')) {
      console.log('\n🟢 Postgres está pronto e aceitando conexões!\n');
    } else {
      process.stdout.write('.');

      setTimeout(checkPostgres, 2000);
    }
  });
}

console.log('\n🔴 Aguardando Postgres aceitar conexões...');
checkPostgres();
