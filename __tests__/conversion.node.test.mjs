import test from 'node:test';
import assert from 'node:assert/strict';

const FIXED = { EUR_XOF: 655.957, XOF_EUR: 1/655.957, EUR_XAF: 655.957, XAF_EUR: 1/655.957, XOF_XAF: 1, XAF_XOF: 1 };
const fixture = { EUR:1, XOF:655.957, XAF:655.957, NGN:1700, GMD:80, SLE:26.5, GHS:15.5, USD:1.1, GBP:0.84 };
const calculate = (fromCode,toCode,rates,base='EUR') => { const from=fromCode.toUpperCase(); const to=toCode.toUpperCase(); if(from===to)return 1; if(FIXED[`${from}_${to}`])return FIXED[`${from}_${to}`]; if(!rates||typeof rates!=='object')return null; if(from===base&&rates[to])return rates[to]; if(to===base&&rates[from]>0)return 1/rates[from]; const a=Number(rates[from]); const b=Number(rates[to]); return Number.isFinite(a)&&Number.isFinite(b)&&a>0&&b>0?b/a:null; };

test('fixed CFA parities stay exact',()=>{ assert.equal(calculate('EUR','XOF',fixture),655.957); assert.equal(calculate('EUR','XAF',fixture),655.957); assert.equal(calculate('XOF','XAF',fixture),1); assert.equal(calculate('XAF','XOF',fixture),1); });
test('critical V1 currencies support identity conversion',()=>{ for(const code of ['XOF','XAF','GMD','SLE','GHS','NGN','USD','EUR','GBP'])assert.equal(calculate(code,code,fixture),1); });
test('critical cross rates triangulate correctly',()=>{ for(const [from,to] of [['GMD','NGN'],['SLE','XOF'],['GHS','USD'],['NGN','GBP'],['USD','EUR'],['GBP','XAF']]) assert.ok(Math.abs(calculate(from,to,fixture)-(fixture[to]/fixture[from]))<1e-10); });
test('swap rates are reciprocal',()=>{ for(const [from,to] of [['GMD','XOF'],['SLE','EUR'],['GHS','NGN'],['USD','GBP']]) assert.ok(Math.abs(calculate(from,to,fixture)*calculate(to,from,fixture)-1)<1e-10); });
test('missing market data never fabricates a rate',()=>{ assert.equal(calculate('GMD','KES',fixture),null); assert.equal(calculate('KES','XOF',fixture),null); });
