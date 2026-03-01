 ✓ tests/HU-01.test.ts (10)
   ✓ TC-001 — Listado paginado con tamaño por defecto (HU-01) (1)
     ✓ debe retornar 20 tickets y paginación correcta cuando no se especifica limit
   ✓ TC-002 — Listado paginado con tamaño configurable (HU-01) (1)
     ✓ debe retornar 10 tickets y paginación correcta cuando limit=10
   ✓ TC-003 — Indicación de total de resultados y página actual (HU-01) (1)
     ✓ debe retornar la metadata correcta de paginación y 15 tickets en la página 3
   ✓ TC-004 — Ordenamiento consistente entre páginas (HU-01) (1)
     ✓ debe retornar los tickets ordenados ascendentemente por fecha de creación en ambas páginas
   ✓ TC-005 — Lista vacía cuando no hay tickets (HU-01) (1)
     ✓ debe retornar un arreglo vacío y paginación en cero cuando no hay tickets
   ✓ TC-006 — Solicitar página fuera de rango (HU-01) (1)
     ✓ debe retornar un arreglo vacío y la metadata correcta cuando se solicita una página fuera de rango
   ✓ TC-007 — Tamaño de página con valores inválidos (HU-01) (4)
     ✓ debe retornar 400 y mensaje de error para limit=0
     ✓ debe retornar 400 y mensaje de error para limit negativo
     ✓ debe retornar 400 y mensaje de error para limit mayor al máximo
     ✓ debe retornar 400 y mensaje de error para limit no numérico

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  17:23:26
   Duration  1.26s (transform 158ms, setup 1ms, collect 326ms, tests 223ms, environment 0ms, prepare 175ms)

 % Coverage report from v8
-----------------------|---------|----------|---------|---------|-------------------
File                   | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-----------------------|---------|----------|---------|---------|-------------------
All files              |    92.9 |    90.62 |     100 |    92.9 |                   
 src                   |   79.48 |       50 |     100 |   79.48 |                   
  index.ts             |   79.48 |       50 |     100 |   79.48 | 28-29,34-39       
 src/controllers       |     100 |      100 |     100 |     100 |                   
  ticketsController.ts |     100 |      100 |     100 |     100 |                   
 src/repositories      |     100 |      100 |     100 |     100 |                   
  ticketRepository.ts  |     100 |      100 |     100 |     100 |                   
 src/routes            |     100 |      100 |     100 |     100 |                   
  tickets.ts           |     100 |      100 |     100 |     100 |                   
 src/services          |   93.33 |    88.88 |     100 |   93.33 |                   
  ticketsService.ts    |   93.33 |    88.88 |     100 |   93.33 | 11-12             
-----------------------|---------|----------|---------|---------|-------------------