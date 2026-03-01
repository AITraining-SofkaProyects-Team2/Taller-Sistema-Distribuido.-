 FAIL  tests/HU-02.test.ts > HU-02 - Filtro por estado > TC-008 - Un solo estado válido > Given existen tickets con diferentes estados, When se solicita "RECEIVED", Then solo retorna tickets "RECEIVED"
AssertionError: expected 404 to be 200 // Object.is equality

- Expected
+ Received

- 200
+ 404

 ❯ tests/HU-02.test.ts:30:37
     28|             const response = await request(app).get('/api/tickets?status=RECEIVED');
     29| 
     30|             expect(response.status).toBe(200);
       |                                     ^
     31|             expect(Array.isArray(response.body.data)).toBe(true);
     32|             response.body.data.forEach((ticket: any) => {

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/7]⎯

 FAIL  tests/HU-02.test.ts > HU-02 - Filtro por estado > TC-008 - Un solo estado válido > When se solicita "IN_PROGRESS", Then solo retorna tickets "IN_PROGRESS"
AssertionError: expected 404 to be 200 // Object.is equality

- Expected
+ Received

- 200
+ 404

 ❯ tests/HU-02.test.ts:41:37
     39|             const response = await request(app).get('/api/tickets?status=IN_PROGRESS');
     40| 
     41|             expect(response.status).toBe(200);
       |                                     ^
     42|             response.body.data.forEach((ticket: any) => {
     43|                 expect(ticket.status).toBe('IN_PROGRESS');

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/7]⎯

 FAIL  tests/HU-02.test.ts > HU-02 - Filtro por estado > TC-009 - Múltiples estados > Given existen tickets "RECEIVED" e "IN_PROGRESS", When se solicitan ambos, Then retorna la unión
AssertionError: expected 404 to be 200 // Object.is equality

- Expected
+ Received

- 200
+ 404

 ❯ tests/HU-02.test.ts:58:37
     56|             const response = await request(app).get('/api/tickets?status=RECEIVED&status=IN_PROGRESS');
     57| 
     58|             expect(response.status).toBe(200);
       |                                     ^
     59|             const statuses = response.body.data.map((t: any) => t.status);
     60|             const uniqueStatuses = [...new Set(statuses)];

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/7]⎯

 FAIL  tests/HU-02.test.ts > HU-02 - Filtro por estado > TC-010 - Combinación con otros filtros > Given tickets variados, When se solicita "IN_PROGRESS" y prioridad "HIGH", Then aplica intersección
AssertionError: expected 404 to be 200 // Object.is equality

- Expected
+ Received

- 200
+ 404

 ❯ tests/HU-02.test.ts:75:37
     73|             const response = await request(app).get('/api/tickets?status=IN_PROGRESS&priority=HIGH');
     74| 
     75|             expect(response.status).toBe(200);
       |                                     ^
     76|             response.body.data.forEach((ticket: any) => {
     77|                 expect(ticket.status).toBe('IN_PROGRESS');

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/7]⎯

 FAIL  tests/HU-02.test.ts > HU-02 - Filtro por estado > TC-011 - Estado inválido > When se solicita un estado inexistente "CLOSED", Then responde HTTP 400
AssertionError: expected 404 to be 400 // Object.is equality

- Expected
+ Received

- 400
+ 404

 ❯ tests/HU-02.test.ts:92:37
     90|             const response = await request(app).get('/api/tickets?status=CLOSED');
     91| 
     92|             expect(response.status).toBe(400);
       |                                     ^
     93|             expect(response.body.message).toMatch(/no es un estado válido/i);
     94|             expect(response.body.validValues).toContain('RECEIVED');

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/7]⎯

 FAIL  tests/HU-02.test.ts > HU-02 - Filtro por estado > TC-011 - Estado inválido > When se solicita un estado en minúsculas "received", Then responde HTTP 400
AssertionError: expected 404 to be 400 // Object.is equality

- Expected
+ Received

- 400
+ 404

 ❯ tests/HU-02.test.ts:101:37
     99|         it('When se solicita un estado en minúsculas "received", Then responde HTTP 400', async () => {
    100|             const response = await request(app).get('/api/tickets?status=received');
    101|             expect(response.status).toBe(400);
       |                                     ^
    102|         });
    103|     });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[6/7]⎯

 FAIL  tests/HU-02.test.ts > HU-02 - Filtro por estado > TC-012 - Sin resultados > Given solo existen tickets "IN_PROGRESS", When se solicita "RECEIVED", Then retorna data vacía
AssertionError: expected 404 to be 200 // Object.is equality

- Expected
+ Received

- 200
+ 404

 ❯ tests/HU-02.test.ts:114:37
    112|             const response = await request(app).get('/api/tickets?status=RECEIVED');
    113| 
    114|             expect(response.status).toBe(200);
       |                                     ^
    115|             expect(response.body.data).toEqual([]);
    116|             expect(response.body.pagination.totalItems).toBe(0);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[7/7]⎯

 Test Files  1 failed (1)
      Tests  7 failed (7)
   Start at  16:37:54
   Duration  1.11s (transform 99ms, setup 0ms, collect 263ms, tests 110ms, environment 0ms, prepare 181ms)
