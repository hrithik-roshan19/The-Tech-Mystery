// Pure guards: no database or Clerk connections, no env file content printed.
const { it } = require('node:test');
const assert = require('node:assert/strict');
const { validateTarget, credentials } = require('../scripts/clerk-development');
const name = 'htg_clerk_dev_0123456789abcdef';
it('accepts only the generated loopback replica-set test target', () => {
  assert.ok(validateTarget(`mongodb://127.0.0.1:35001/${name}?replicaSet=${name}`, name, name));
});
it('rejects live names, live ports, remote hosts and mismatched replica sets before connecting', () => {
  for (const uri of [
    `mongodb://127.0.0.1:35001/hack_the_grid?replicaSet=${name}`,
    `mongodb://127.0.0.1:27017/${name}?replicaSet=${name}`,
    `mongodb://127.0.0.1:27027/${name}?replicaSet=${name}`,
    `mongodb://remote.invalid:35001/${name}?replicaSet=${name}`,
    `mongodb://127.0.0.1:35001/${name}?replicaSet=other`,
    `mongodb://127.0.0.1:35001/${name}`
  ]) assert.throws(() => validateTarget(uri, name, name));
});
it('reports missing variable names without fabricating keys', () => {
  const names = ['CLERK_SECRET_KEY', 'CLERK_JWT_ISSUER_DOMAIN', 'CLERK_AUTHORIZED_PARTIES', 'VITE_CLERK_PUBLISHABLE_KEY', 'CLERK_JWT_KEY'];
  const previous = Object.fromEntries(names.map(name => [name, process.env[name]]));
  try {
    for (const name of names) delete process.env[name];
    assert.throws(() => credentials([]), /Missing configuration: CLERK_SECRET_KEY, CLERK_JWT_ISSUER_DOMAIN, CLERK_AUTHORIZED_PARTIES, VITE_CLERK_PUBLISHABLE_KEY/);
  } finally {
    for (const name of names) if (previous[name] === undefined) delete process.env[name]; else process.env[name] = previous[name];
  }
});
