 FAIL  src/__tests__/HU-04.test.ts > HU-04 - Filtro por tipo de incidente (Query Service) > TC-018 - Filtrar por tipo de incidente válido > debe retornar solo tickets del tipo solicitado (NO_SERVICE)
Error: expected 200 "OK", got 404 "Not Found"
 ❯ src/__tests__/HU-04.test.ts:44:18
     42|             const response = await request(app)
     43|                 .get('/api/tickets?incidentType=NO_SERVICE')
     44|                 .expect(200);
       |                  ^
     45| 
     46|             expect(response.body.data).toBeInstanceOf(Array);
 ❯ Test._assertStatus node_modules/supertest/lib/test.js:309:14
 ❯ node_modules/supertest/lib/test.js:365:13
 ❯ Test._assertFunction node_modules/supertest/lib/test.js:342:13
 ❯ Test.assert node_modules/supertest/lib/test.js:195:23
 ❯ localAssert node_modules/supertest/lib/test.js:138:14
 ❯ Server.<anonymous> node_modules/supertest/lib/test.js:152:11
 ❯ Object.onceWrapper node:events:622:28
 ❯ Server.emit node:events:508:28
 ❯ emitCloseNT node:net:2427:8

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/7]⎯

 FAIL  src/__tests__/HU-04.test.ts > HU-04 - Filtro por tipo de incidente (Query Service) > TC-018 - Filtrar por tipo de incidente válido > debe retornar solo tickets del tipo solicitado (OTHER)
Error: expected 200 "OK", got 404 "Not Found"
 ❯ src/__tests__/HU-04.test.ts:54:18
     52|             const response = await request(app)
     53|                 .get('/api/tickets?incidentType=OTHER')
     54|                 .expect(200);
       |                  ^
     55| 
     56|             expect(response.body.data.every((t: any) => t.type === 'OTHER')).toBe(true);
 ❯ Test._assertStatus node_modules/supertest/lib/test.js:309:14
 ❯ node_modules/supertest/lib/test.js:365:13
 ❯ Test._assertFunction node_modules/supertest/lib/test.js:342:13
 ❯ Test.assert node_modules/supertest/lib/test.js:195:23
 ❯ localAssert node_modules/supertest/lib/test.js:138:14
 ❯ Server.<anonymous> node_modules/supertest/lib/test.js:152:11
 ❯ Object.onceWrapper node:events:622:28
 ❯ Server.emit node:events:508:28
 ❯ emitCloseNT node:net:2427:8

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/7]⎯

 FAIL  src/__tests__/HU-04.test.ts > HU-04 - Filtro por tipo de incidente (Query Service) > TC-020 - Combinar filtro de tipo con estado y prioridad > debe retornar la intersección de los tres filtros (AND)
Error: expected 200 "OK", got 404 "Not Found"
 ❯ src/__tests__/HU-04.test.ts:91:18
     89|             const response = await request(app)
     90|                 .get('/api/tickets?incidentType=NO_SERVICE&status=IN_PROGRESS&priority=HIGH')
     91|                 .expect(200);
       |                  ^
     92| 
     93|             expect(response.body.pagination.totalItems).toBe(1);
 ❯ Test._assertStatus node_modules/supertest/lib/test.js:309:14
 ❯ node_modules/supertest/lib/test.js:365:13
 ❯ Test._assertFunction node_modules/supertest/lib/test.js:342:13
 ❯ Test.assert node_modules/supertest/lib/test.js:195:23
 ❯ localAssert node_modules/supertest/lib/test.js:138:14
 ❯ Server.<anonymous> node_modules/supertest/lib/test.js:152:11
 ❯ Object.onceWrapper node:events:622:28
 ❯ Server.emit node:events:508:28
 ❯ emitCloseNT node:net:2427:8

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/7]⎯

 FAIL  src/__tests__/HU-04.test.ts > HU-04 - Filtro por tipo de incidente (Query Service) > TC-020 - Combinar filtro de tipo con estado y prioridad > debe retornar resultados consistentes con la tabla de decisión (solo tipo)
Error: expected 200 "OK", got 404 "Not Found"
 ❯ src/__tests__/HU-04.test.ts:102:18
    100|             const response = await request(app)
    101|                 .get('/api/tickets?incidentType=NO_SERVICE')
    102|                 .expect(200);
       |                  ^
    103| 
    104|             expect(response.body.pagination.totalItems).toBe(2); // Basado en T-001 y T-003
 ❯ Test._assertStatus node_modules/supertest/lib/test.js:309:14
 ❯ node_modules/supertest/lib/test.js:365:13
 ❯ Test._assertFunction node_modules/supertest/lib/test.js:342:13
 ❯ Test.assert node_modules/supertest/lib/test.js:195:23
 ❯ localAssert node_modules/supertest/lib/test.js:138:14
 ❯ Server.<anonymous> node_modules/supertest/lib/test.js:152:11
 ❯ Object.onceWrapper node:events:622:28
 ❯ Server.emit node:events:508:28
 ❯ emitCloseNT node:net:2427:8

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/7]⎯

 FAIL  src/__tests__/HU-04.test.ts > HU-04 - Filtro por tipo de incidente (Query Service) > TC-021 - Filtrar con tipo de incidente inválido > debe retornar 400 cuando el tipo no existe en el dominio
Error: expected 400 "Bad Request", got 404 "Not Found"
 ❯ src/__tests__/HU-04.test.ts:130:18
    128|             const response = await request(app)
    129|                 .get('/api/tickets?incidentType=HARDWARE_FAILURE')
    130|                 .expect(400);
       |                  ^
    131| 
    132|             expect(response.body.error).toBeDefined();
 ❯ Test._assertStatus node_modules/supertest/lib/test.js:309:14
 ❯ node_modules/supertest/lib/test.js:365:13
 ❯ Test._assertFunction node_modules/supertest/lib/test.js:342:13
 ❯ Test.assert node_modules/supertest/lib/test.js:195:23
 ❯ localAssert node_modules/supertest/lib/test.js:138:14
 ❯ Server.<anonymous> node_modules/supertest/lib/test.js:152:11
 ❯ Object.onceWrapper node:events:622:28
 ❯ Server.emit node:events:508:28
 ❯ emitCloseNT node:net:2427:8

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/7]⎯

 FAIL  src/__tests__/HU-04.test.ts > HU-04 - Filtro por tipo de incidente (Query Service) > TC-021 - Filtrar con tipo de incidente inválido > debe retornar 400 cuando el valor es numérico
Error: expected 400 "Bad Request", got 404 "Not Found"
 ❯ src/__tests__/HU-04.test.ts:139:18
    137|             await request(app)
    138|                 .get('/api/tickets?incidentType=123')
    139|                 .expect(400);
       |                  ^
    140|         });
    141| 
 ❯ Test._assertStatus node_modules/supertest/lib/test.js:309:14
 ❯ node_modules/supertest/lib/test.js:365:13
 ❯ Test._assertFunction node_modules/supertest/lib/test.js:342:13
 ❯ Test.assert node_modules/supertest/lib/test.js:195:23
 ❯ localAssert node_modules/supertest/lib/test.js:138:14
 ❯ Server.<anonymous> node_modules/supertest/lib/test.js:152:11
 ❯ Object.onceWrapper node:events:622:28
 ❯ Server.emit node:events:508:28
 ❯ emitCloseNT node:net:2427:8

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/7]⎯

 FAIL  src/__tests__/HU-04.test.ts > HU-04 - Filtro por tipo de incidente (Query Service) > TC-021 - Filtrar con tipo de incidente inválido > debe ser sensible a mayúsculas según contrato (no_service es inválido)
Error: expected 400 "Bad Request", got 404 "Not Found"
 ❯ src/__tests__/HU-04.test.ts:145:18
    143|             await request(app)
    144|                 .get('/api/tickets?incidentType=no_service')
    145|                 .expect(400);
       |                  ^
    146|         });
    147|     });
 ❯ Test._assertStatus node_modules/supertest/lib/test.js:309:14
 ❯ node_modules/supertest/lib/test.js:365:13
 ❯ Test._assertFunction node_modules/supertest/lib/test.js:342:13
 ❯ Test.assert node_modules/supertest/lib/test.js:195:23
 ❯ localAssert node_modules/supertest/lib/test.js:138:14
 ❯ Server.<anonymous> node_modules/supertest/lib/test.js:152:11
 ❯ Object.onceWrapper node:events:622:28
 ❯ Server.emit node:events:508:28
 ❯ emitCloseNT node:net:2427:8


 Test Files  1 failed (1)
      Tests  7 failed (7)
   Start at  16:41:39
   Duration  1.08s (transform 108ms, setup 0ms, collect 250ms, tests 105ms, environment 0ms, prepare 176ms)