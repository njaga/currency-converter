import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../lib/travel-services.js', import.meta.url), 'utf8');
const { fetchTravelFinancialServices } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

const place = (id, name) => ({ id, name, address: `${name} address` });

test('Travel Pack downloads banks and exchange offices in parallel', async () => {
  const calls = [];
  const fetcher = async (url) => {
    calls.push(url);
    const type = new URL(url, 'https://kiwango.test').searchParams.get('type');
    return { ok: true, json: async () => ({ places: [place(type, type)] }) };
  };

  const snapshot = await fetchTravelFinancialServices({ destination: 'Kenya', lang: 'fr', fetcher });
  assert.equal(snapshot.syncState, 'complete');
  assert.equal(snapshot.banks.length, 1);
  assert.equal(snapshot.exchange.length, 1);
  assert.deepEqual(snapshot.updatedTypes.sort(), ['banks', 'exchange']);
  assert.equal(calls.length, 2);
  assert.ok(calls.every((url) => !url.includes('route')));
});

test('Travel Pack preserves the last offline copy when one Google request fails', async () => {
  const previous = {
    fetchedAt: 1000,
    banks: [place('old-bank', 'Old bank')],
    exchange: [place('old-exchange', 'Old exchange')],
  };
  const fetcher = async (url) => {
    const type = new URL(url, 'https://kiwango.test').searchParams.get('type');
    if (type === 'exchange') throw new Error('temporary failure');
    return { ok: true, json: async () => ({ places: [place('new-bank', 'New bank')] }) };
  };

  const snapshot = await fetchTravelFinancialServices({ destination: 'Kenya', previous, fetcher });
  assert.equal(snapshot.syncState, 'partial');
  assert.equal(snapshot.banks[0].id, 'new-bank');
  assert.equal(snapshot.exchange[0].id, 'old-exchange');
  assert.deepEqual(snapshot.preservedTypes, ['exchange']);
});
