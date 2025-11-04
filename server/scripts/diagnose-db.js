/*
 Simple MongoDB connectivity diagnostics for persistent connection errors
 Usage: node scripts/diagnose-db.js
*/

const dns = require('dns');
const url = require('url');
const tls = require('tls');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || '';

function log(title, details) {
  console.log(`\n=== ${title} ===`);
  if (details) console.log(details);
}

function exitWith(code) {
  console.log('\nDiagnostics complete.');
  process.exit(code);
}

async function resolveSrvRecords(host) {
  return new Promise((resolve, reject) => {
    const srv = `_mongodb._tcp.${host}`;
    dns.resolveSrv(srv, (err, addresses) => {
      if (err) return reject(err);
      resolve(addresses);
    });
  });
}

async function resolveTxtRecords(host) {
  return new Promise((resolve, reject) => {
    dns.resolveTxt(host, (err, records) => {
      if (err) return reject(err);
      resolve(records);
    });
  });
}

async function main() {
  log('MONGO_URI presence check');
  if (!MONGO_URI) {
    console.error('MONGO_URI is not set. Create server/.env and set MONGO_URI.');
    return exitWith(1);
  }
  console.log(`MONGO_URI: ${MONGO_URI.replace(/:\/\/(.*?):(.*?)@/, '://<user>:<pass>@')}`);

  const parsed = url.parse(MONGO_URI);
  const isSrv = parsed.protocol === 'mongodb+srv:';
  const host = parsed.host;
  console.log(`Protocol: ${parsed.protocol}`);
  console.log(`Host: ${host}`);

  if (isSrv) {
    try {
      log('DNS SRV lookup');
      const srvRecords = await resolveSrvRecords(host);
      console.table(srvRecords.map(r => ({ name: r.name, port: r.port, priority: r.priority, weight: r.weight })));

      log('DNS TXT lookup (driver options)');
      const txtRecords = await resolveTxtRecords(host);
      console.log(txtRecords);
    } catch (e) {
      console.error('DNS resolution failed:', e.message);
      console.error('This can be a local DNS issue, VPN, or firewall. Try switching networks or using a non-SRV connection string from Atlas.');
      return exitWith(1);
    }
  } else {
    log('Non-SRV URI detected');
  }

  // Try a TLS connection to one of the hosts (Atlas requires TLS)
  try {
    log('Attempt TLS connectivity to first resolved host (Atlas node)');
    let targetHost = host;
    let targetPort = 27017;

    if (isSrv) {
      const srvRecords = await resolveSrvRecords(host);
      if (!srvRecords.length) throw new Error('No SRV records found');
      targetHost = srvRecords[0].name;
      targetPort = srvRecords[0].port || 27017;
    }

    await new Promise((resolve, reject) => {
      const socket = tls.connect({ host: targetHost, port: targetPort, servername: targetHost, rejectUnauthorized: false }, () => {
        console.log(`TLS connected to ${targetHost}:${targetPort}`);
        socket.end();
        resolve();
      });
      socket.on('error', reject);
    });
  } catch (e) {
    console.error('TLS connectivity failed:', e.message);
    console.error('Likely network/firewall/VPN issue. Ensure outbound 27017 is allowed and try disabling VPN.');
    return exitWith(1);
  }

  log('Next steps');
  console.log('- If IP whitelist is already configured, ensure it includes your current public IP.');
  console.log('- If password contains special characters, URL-encode it in the URI.');
  console.log('- If problem persists, generate Standard (non-SRV) connection string in Atlas and try it.');
  exitWith(0);
}

main();



