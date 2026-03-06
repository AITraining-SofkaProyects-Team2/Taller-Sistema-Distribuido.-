 FAIL  tests/HU-05.test.ts > HU-05 - Filtro por rango de fechas > TC-022 - Query Service + Frontend - Filtrar por rango de fechas válido > debe filtrar correctamente los tickets dentro de un rango de fechas válido
AssertionError: expected 404 to be 200 // Object.is equality

- Expected
+ Received

- 200
+ 404

 ❯ tests/HU-05.test.ts:37:31
     35|       // RED: Esperamos 200 pero probablemente devuelva algo distinto o no filtre (depende de la implementación actual de ind…
     36|       // Actualmente index.ts solo tiene /health, por lo que /api/tickets devolverá 404.
     37|       expect(response.status).toBe(200);
       |                               ^
     38|       expect(response.body).toHaveProperty('data');
     39|       expect(response.body.pagination.totalItems).toBeGreaterThan(0);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/7]⎯

 FAIL  tests/HU-05.test.ts > HU-05 - Filtro por rango de fechas > TC-023 - Query Service + Frontend - Validar que fecha fin sea mayor o igual a fecha inicio > debe rechazar un rango de fechas invertido con HTTP 400
AssertionError: expected 404 to be 400 // Object.is equality

- Expected
+ Received

- 400
+ 404

 ❯ tests/HU-05.test.ts:70:31
     68|         });
     69| 
     70|       expect(response.status).toBe(400);
       |                               ^
     71|       expect(response.body.error).toMatch(/dateTo.*mayor.*igual.*dateFrom/i);
     72|     });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/7]⎯

 FAIL  tests/HU-05.test.ts > HU-05 - Filtro por rango de fechas > TC-024 - Query Service + Frontend - Rango de fechas sin resultados coincidentes > debe retornar una lista vacía si no hay resultados en el rango
AssertionError: expected 404 to be 200 // Object.is equality

- Expected
+ Received

- 200
+ 404

 ❯ tests/HU-05.test.ts:94:31
     92|         });
     93| 
     94|       expect(response.status).toBe(200);
       |                               ^
     95|       expect(response.body.data).toEqual([]);
     96|       expect(response.body.pagination.totalItems).toBe(0);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/7]⎯

 FAIL  tests/HU-05.test.ts > HU-05 - Filtro por rango de fechas > TC-025 - Query Service + Frontend - Filtrar con solo fecha inicio (sin fecha fin) > debe filtrar correctamente usando solo dateFrom
AssertionError: expected 404 to be 200 // Object.is equality

- Expected
+ Received

- 200
+ 404

 ❯ tests/HU-05.test.ts:117:31
    115|         });
    116| 
    117|       expect(response.status).toBe(200);
       |                               ^
    118|       response.body.data.forEach((ticket: any) => {
    119|         const createdAt = new Date(ticket.createdAt).getTime();

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/7]⎯

 FAIL  tests/HU-05.test.ts > HU-05 - Filtro por rango de fechas > TC-026 - Query Service + Frontend - Filtrar con solo fecha fin (sin fecha inicio) > debe filtrar correctamente usando solo dateTo
AssertionError: expected 404 to be 200 // Object.is equality

- Expected
+ Received

- 200
+ 404

 ❯ tests/HU-05.test.ts:143:31
    141|         });
    142| 
    143|       expect(response.status).toBe(200);
       |                               ^
    144|       response.body.data.forEach((ticket: any) => {
    145|         const createdAt = new Date(ticket.createdAt).getTime();

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/7]⎯

 FAIL  tests/HU-05.test.ts > HU-05 - Filtro por rango de fechas > TC-027 - Query Service + Frontend - Fechas con formato inválido > debe rechazar formatos de fecha inválidos con HTTP 400
AssertionError: expected 404 to be 400 // Object.is equality

- Expected
+ Received

- 400
+ 404

 ❯ tests/HU-05.test.ts:169:31
    167|         });
    168| 
    169|       expect(response.status).toBe(400);
       |                               ^
    170|       expect(response.body.error).toMatch(/formato.*inválido/i);
    171|     });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/7]⎯

 FAIL  tests/HU-05.test.ts > HU-05 - Filtro por rango de fechas > TC-027 - Query Service + Frontend - Fechas con formato inválido > debe rechazar valores que no son fechas con HTTP 400
AssertionError: expected 404 to be 400 // Object.is equality

- Expected
+ Received

- 400
+ 404

 ❯ tests/HU-05.test.ts:180:31
    178|         });
    179| 
    180|       expect(response.status).toBe(400);
       |                               ^
    181|       expect(response.body.error).toMatch(/formato.*inválido/i);
    182|     });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/7]⎯

 Test Files  1 failed (1)
      Tests  7 failed (7)
   Start at  16:46:26
   Duration  1.07s (transform 105ms, setup 1ms, collect 243ms, tests 102ms, environment 0ms, prepare 180ms)
