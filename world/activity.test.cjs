const assert=require('node:assert/strict');
const test=require('node:test');
const {classify,summarize}=require('./activity-model.js');
const now=Date.parse('2026-09-20T12:00:00Z');
const sample={state:'running',checkedAt:'2026-09-20T11:59:00Z',staleAfterSeconds:900};
test('fresh running work alone activates the work indicator',()=>{
 assert.equal(classify(sample,now).active,true);
 assert.equal(classify({...sample,state:'ok'},now).active,false);
 assert.equal(classify({...sample,state:'idle'},now).active,false);
});
test('expired and future observations cannot activate work',()=>{
 assert.equal(classify({...sample,checkedAt:'2026-09-20T11:00:00Z'},now).state,'stale');
 assert.equal(classify({...sample,checkedAt:'2026-09-21T12:00:00Z'},now).active,false);
});
test('missing, malformed and unrecognized source data is not success',()=>{
 for(const value of [null,{}, {...sample,state:'green'}, {...sample,checkedAt:'bad'}, {...sample,staleAfterSeconds:0}]) assert.equal(classify(value,now).active,false);
});
test('explicit source failures and access requirements are preserved',()=>{
 assert.equal(classify({...sample,state:'failed'},now).state,'failed');
 assert.equal(classify({...sample,state:'blocked'},now).state,'blocked');
});
test('queued and supervisor availability are never active work',()=>{
 assert.equal(classify({...sample,state:'queued'},now).active,false);
 assert.equal(classify({...sample,state:'stopping'},now).active,false);
 assert.equal(classify({...sample,state:'available'},now).active,false);
});
test('benign completed workflow outcomes remain non-active and explicit',()=>{
 assert.equal(classify({...sample,state:'cancelled'},now).active,false);
 assert.equal(classify({...sample,state:'skipped'},now).active,false);
 assert.equal(classify({...sample,state:'neutral'},now).active,false);
});
test('actual workflow activity outranks process availability regardless of source order',()=>{
 const available={...sample,state:'available'};
 for(const signals of [[available,sample],[sample,available]]) {
  assert.equal(summarize(signals,now).state,'running');
  assert.equal(summarize(signals,now).active,true);
 }
 assert.equal(summarize([available,{...sample,state:'queued'},{...sample,state:'ok'}],now).state,'queued');
 assert.equal(summarize([sample,{...sample,state:'failed'}],now).active,false);
});
