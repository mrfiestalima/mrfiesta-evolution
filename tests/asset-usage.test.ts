import test from 'node:test';
import assert from 'node:assert/strict';
import { assetUsage, contentUsage } from '../supabase/functions/_shared/assetUsage';

test('reports draft, published fallback, and all celebration relationships', () => {
  const url='https://media.test/logo.mp4';
  const result=assetUsage(url,[{kind:'published',content:{}},{kind:'draft',content:{liveAsset:{url}}}],
    [{id:'one',title:'Fiesta',published:true,cover_url:null,trailer_url:url}],
    [{celebration_id:'one',url}],url);
  assert.deepEqual(result,['Web publicada · Cabecera / Portada','Borrador · MR Fiesta Live','Celebración: Fiesta (publicada) · Video','Celebración: Fiesta (publicada) · Galería']);
});
test('orphan media stays in library without counting as a celebration assignment', () => {
  assert.deepEqual(assetUsage('a',[],[],[{celebration_id:null,url:'a'}],''),[]);
});
test('disabled sections still retain references and matches are exact', () => {
  assert.deepEqual(contentUsage({experiences:[{name:'LED',enabled:false,asset:{url:'a'}}],technology:[{name:'Robot',asset:{url:'ab'}}]},'a'),['Experiencia: LED']);
});
