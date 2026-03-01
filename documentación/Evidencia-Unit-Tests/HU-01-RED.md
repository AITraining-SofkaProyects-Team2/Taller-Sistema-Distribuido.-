 FAIL  tests/HU-01.test.ts [ tests/HU-01.test.ts ]
Error: Failed to load url ../src/app (resolved id: ../src/app) in /home/matias/Documentos/semana_02/Taller-Sistema-Distribuido.-/backend/reports-query/tests/HU-01.test.ts. Does the file exist?
 ❯ loadAndTransform node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:51969:17

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed (1)
      Tests  no tests
   Start at  16:51:00
   Duration  907ms (transform 104ms, setup 0ms, collect 0ms, tests 0ms, environment 0ms, prepare 181ms)

[ble: exit 1]
matias@matias-Inspiron-3505:~/Documentos/semana_02/Taller-Sistema-Distribuido.-/backend/reports-query$ npm run test

> reports-query@1.0.0 test
> vitest run --coverage

The CJS build of Vite's Node API is deprecated. See https://vite.dev/guide/troubleshooting.html#vite-cjs-node-api-deprecated for more details.

 RUN  v1.6.1 /home/matias/Documentos/semana_02/Taller-Sistema-Distribuido.-/backend/reports-query
      Coverage enabled with v8

 ❯ tests/HU-01.test.ts (10)
   ❯ TC-001 — Listado paginado con tamaño por defecto (HU-01) (1)
     × debe retornar 20 tickets y paginación correcta cuando no se especifica limit
   ❯ TC-002 — Listado paginado con tamaño configurable (HU-01) (1)
     × debe retornar 10 tickets y paginación correcta cuando limit=10
   ❯ TC-003 — Indicación de total de resultados y página actual (HU-01) (1)
     × debe retornar la metadata correcta de paginación y 15 tickets en la página 3
   ❯ TC-004 — Ordenamiento consistente entre páginas (HU-01) (1)
     × debe retornar los tickets ordenados ascendentemente por fecha de creación en ambas páginas
   ❯ TC-005 — Lista vacía cuando no hay tickets (HU-01) (1)
     × debe retornar un arreglo vacío y paginación en cero cuando no hay tickets
   ❯ TC-006 — Solicitar página fuera de rango (HU-01) (1)
     × debe retornar un arreglo vacío y la metadata correcta cuando se solicita una página fuera de rango
   ❯ TC-007 — Tamaño de página con valores inválidos (HU-01) (4)
     × debe retornar 400 y mensaje de error para limit=0
     × debe retornar 400 y mensaje de error para limit negativo
     × debe retornar 400 y mensaje de error para limit mayor al máximo
     × debe retornar 400 y mensaje de error para limit no numérico

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 10 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/HU-01.test.ts > TC-001 — Listado paginado con tamaño por defecto (HU-01) > debe retornar 20 tickets y paginación correcta cuando no se especifica limit
Error: expected 200 "OK", got 404 "Not Found"
 ❯ tests/HU-01.test.ts:37:8
     35|     const res = await request(app)
     36|       .get('/api/tickets')
     37|       .expect(200);
       |        ^
     38| 
     39|     expect(Array.isArray(res.body.data)).toBe(true);
 ❯ Test._assertStatus node_modules/supertest/lib/test.js:309:14
 ❯ node_modules/supertest/lib/test.js:365:13
 ❯ Test._assertFunction node_modules/supertest/lib/test.js:342:13
 ❯ Test.assert node_modules/supertest/lib/test.js:195:23
 ❯ localAssert node_modules/supertest/lib/test.js:138:14
 ❯ Server.<anonymous> node_modules/supertest/lib/test.js:152:11
 ❯ Object.onceWrapper node:events:622:28
 ❯ Server.emit node:events:508:28
 ❯ emitCloseNT node:net:2427:8

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/10]⎯

 FAIL  tests/HU-01.test.ts > TC-002 — Listado paginado con tamaño configurable (HU-01) > debe retornar 10 tickets y paginación correcta cuando limit=10
Error: expected 200 "OK", got 404 "Not Found"
 ❯ tests/HU-01.test.ts:77:8
     75|     const res = await request(app)
     76|       .get('/api/tickets?limit=10')
     77|       .expect(200);
       |        ^
     78| 
     79|     expect(Array.isArray(res.body.data)).toBe(true);
 ❯ Test._assertStatus node_modules/supertest/lib/test.js:309:14
 ❯ node_modules/supertest/lib/test.js:365:13
 ❯ Test._assertFunction node_modules/supertest/lib/test.js:342:13
 ❯ Test.assert node_modules/supertest/lib/test.js:195:23
 ❯ localAssert node_modules/supertest/lib/test.js:138:14
 ❯ Server.<anonymous> node_modules/supertest/lib/test.js:152:11
 ❯ Object.onceWrapper node:events:622:28
 ❯ Server.emit node:events:508:28
 ❯ emitCloseNT node:net:2427:8

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/10]⎯

 FAIL  tests/HU-01.test.ts > TC-003 — Indicación de total de resultados y página actual (HU-01) > debe retornar la metadata correcta de paginación y 15 tickets en la página 3
Error: expected 200 "OK", got 404 "Not Found"
 ❯ tests/HU-01.test.ts:116:8
    114|     const res = await request(app)
    115|       .get('/api/tickets?page=3&limit=20')
    116|       .expect(200);
       |        ^
    117| 
    118|     expect(Array.isArray(res.body.data)).toBe(true);
 ❯ Test._assertStatus node_modules/supertest/lib/test.js:309:14
 ❯ node_modules/supertest/lib/test.js:365:13
 ❯ Test._assertFunction node_modules/supertest/lib/test.js:342:13
 ❯ Test.assert node_modules/supertest/lib/test.js:195:23
 ❯ localAssert node_modules/supertest/lib/test.js:138:14
 ❯ Server.<anonymous> node_modules/supertest/lib/test.js:152:11
 ❯ Object.onceWrapper node:events:622:28
 ❯ Server.emit node:events:508:28
 ❯ emitCloseNT node:net:2427:8

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/10]⎯

 FAIL  tests/HU-01.test.ts > TC-004 — Ordenamiento consistente entre páginas (HU-01) > debe retornar los tickets ordenados ascendentemente por fecha de creación en ambas páginas
Error: expected 200 "OK", got 404 "Not Found"
 ❯ tests/HU-01.test.ts:154:8
    152|     const resPage1 = await request(app)
    153|       .get('/api/tickets?limit=20&sort=createdAt&order=asc')
    154|       .expect(200);
       |        ^
    155|     const resPage2 = await request(app)
    156|       .get('/api/tickets?page=2&limit=20&sort=createdAt&order=asc')
 ❯ Test._assertStatus node_modules/supertest/lib/test.js:309:14
 ❯ node_modules/supertest/lib/test.js:365:13
 ❯ Test._assertFunction node_modules/supertest/lib/test.js:342:13
 ❯ Test.assert node_modules/supertest/lib/test.js:195:23
 ❯ localAssert node_modules/supertest/lib/test.js:138:14
 ❯ Server.<anonymous> node_modules/supertest/lib/test.js:152:11
 ❯ Object.onceWrapper node:events:622:28
 ❯ Server.emit node:events:508:28
 ❯ emitCloseNT node:net:2427:8

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/10]⎯

 FAIL  tests/HU-01.test.ts > TC-005 — Lista vacía cuando no hay tickets (HU-01) > debe retornar un arreglo vacío y paginación en cero cuando no hay tickets
Error: expected 200 "OK", got 404 "Not Found"
 ❯ tests/HU-01.test.ts:208:8
    206|     const res = await request(app)
    207|       .get('/api/tickets')
    208|       .expect(200);
       |        ^
    209| 
    210|     expect(Array.isArray(res.body.data)).toBe(true);
 ❯ Test._assertStatus node_modules/supertest/lib/test.js:309:14
 ❯ node_modules/supertest/lib/test.js:365:13
 ❯ Test._assertFunction node_modules/supertest/lib/test.js:342:13
 ❯ Test.assert node_modules/supertest/lib/test.js:195:23
 ❯ localAssert node_modules/supertest/lib/test.js:138:14
 ❯ Server.<anonymous> node_modules/supertest/lib/test.js:152:11
 ❯ Object.onceWrapper node:events:622:28
 ❯ Server.emit node:events:508:28
 ❯ emitCloseNT node:net:2427:8

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/10]⎯

 FAIL  tests/HU-01.test.ts > TC-006 — Solicitar página fuera de rango (HU-01) > debe retornar un arreglo vacío y la metadata correcta cuando se solicita una página fuera de rango
Error: expected 200 "OK", got 404 "Not Found"
 ❯ tests/HU-01.test.ts:245:8
    243|     const res = await request(app)
    244|       .get('/api/tickets?page=5&limit=10')
    245|       .expect(200);
       |        ^
    246| 
    247|     expect(Array.isArray(res.body.data)).toBe(true);
 ❯ Test._assertStatus node_modules/supertest/lib/test.js:309:14
 ❯ node_modules/supertest/lib/test.js:365:13
 ❯ Test._assertFunction node_modules/supertest/lib/test.js:342:13
 ❯ Test.assert node_modules/supertest/lib/test.js:195:23
 ❯ localAssert node_modules/supertest/lib/test.js:138:14
 ❯ Server.<anonymous> node_modules/supertest/lib/test.js:152:11
 ❯ Object.onceWrapper node:events:622:28
 ❯ Server.emit node:events:508:28
 ❯ emitCloseNT node:net:2427:8

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/10]⎯

 FAIL  tests/HU-01.test.ts > TC-007 — Tamaño de página con valores inválidos (HU-01) > debe retornar 400 y mensaje de error para limit=0
AssertionError: expected 404 to be 400 // Object.is equality

- Expected
+ Received

- 400
+ 404

 ❯ tests/HU-01.test.ts:283:24
    281|     const res = await request(app)
    282|       .get('/api/tickets?limit=0');
    283|     expect(res.status).toBe(400);
       |                        ^
    284|     expect(res.body).toHaveProperty('error');
    285|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/10]⎯

 FAIL  tests/HU-01.test.ts > TC-007 — Tamaño de página con valores inválidos (HU-01) > debe retornar 400 y mensaje de error para limit negativo
AssertionError: expected 404 to be 400 // Object.is equality

- Expected
+ Received

- 400
+ 404

 ❯ tests/HU-01.test.ts:290:24
    288|     const res = await request(app)
    289|       .get('/api/tickets?limit=-5');
    290|     expect(res.status).toBe(400);
       |                        ^
    291|     expect(res.body).toHaveProperty('error');
    292|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[8/10]⎯

 FAIL  tests/HU-01.test.ts > TC-007 — Tamaño de página con valores inválidos (HU-01) > debe retornar 400 y mensaje de error para limit mayor al máximo
AssertionError: expected 404 to be 400 // Object.is equality

- Expected
+ Received

- 400
+ 404

 ❯ tests/HU-01.test.ts:297:24
    295|     const res = await request(app)
    296|       .get('/api/tickets?limit=101');
    297|     expect(res.status).toBe(400);
       |                        ^
    298|     expect(res.body).toHaveProperty('error');
    299|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[9/10]⎯

 FAIL  tests/HU-01.test.ts > TC-007 — Tamaño de página con valores inválidos (HU-01) > debe retornar 400 y mensaje de error para limit no numérico
AssertionError: expected 404 to be 400 // Object.is equality

- Expected
+ Received

- 400
+ 404

 ❯ tests/HU-01.test.ts:304:24
    302|     const res = await request(app)
    303|       .get('/api/tickets?limit=abc');
    304|     expect(res.status).toBe(400);
       |                        ^
    305|     expect(res.body).toHaveProperty('error');
    306|   });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[10/10]⎯

 Test Files  1 failed (1)
      Tests  10 failed (10)
   Start at  16:51:53
   Duration  1.07s (transform 88ms, setup 0ms, collect 240ms, tests 131ms, environment 0ms, prepare 175ms)
