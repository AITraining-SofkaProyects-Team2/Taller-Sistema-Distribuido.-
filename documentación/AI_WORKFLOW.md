# AI_WORKFLOW.md
## Marco de Trabajo de Interacción con IA


Este documento define el protocolo de uso de Inteligencia Artificial durante el
desarrollo del aplicativo. Su objetivo es asegurar velocidad de implementación,
calidad del código y control humano sobre las decisiones técnicas.


La IA es utilizada como herramienta de apoyo a la implementación, no como
reemplazo del criterio del equipo.


---


## 1. Metodología


El equipo adopta una metodología **AI-First**, donde la Inteligencia Artificial
actúa como un desarrollador junior encargado de generar estructuras base,
boilerplate y código repetitivo.


Las decisiones de arquitectura, diseño del sistema, comunicación entre
microservicios y validación final del código son responsabilidad del equipo humano.


Ningún código generado por IA se integra al proyecto sin revisión previa y
comprensión por parte del equipo.


---


## 2. Interacciones Clave con la IA


La IA es utilizada en los siguientes momentos del desarrollo:


- Generación de la estructura inicial de los microservicios.
- Creación de boilerplate de APIs, workers y configuración de mensajería.
- Generación de archivos de infraestructura (Dockerfile, docker-compose).
- Refinamiento de lógica previamente definida por el equipo.
- Apoyo en la redacción de documentación técnica.


La IA no toma decisiones de negocio ni de arquitectura por cuenta propia.


---


## 3. Documentos Clave y Contextualización


Antes de cada interacción con la IA, el equipo proporciona un contexto mínimo que
incluye:


- Propósito del aplicativo.
- Arquitectura general del sistema.
- Stack tecnológico definido.
- Responsabilidad del microservicio a generar.
- Restricciones técnicas (uso de RabbitMQ, Docker, comunicación asíncrona).


Los documentos considerados fuente de contexto para la IA son:
- `README.md`
- `AI_WORKFLOW.md`
- Descripciones de tareas en issues o pull requests.


Este contexto permite obtener respuestas más precisas y alineadas al proyecto.


---


## 4. Dinámicas de Interacción


La interacción con la IA sigue un ciclo iterativo:


1. El equipo define el objetivo técnico de la tarea.
2. Se formula un prompt claro y contextualizado.
3. La IA genera una propuesta de solución.
4. El equipo supervisa el resultado.
5. Se refina la solución mediante nuevos prompts si es necesario.
6. El código final es integrado al repositorio.


Este proceso se repite para cada componente del sistema.


---


## 5. Base para la Implementación


Este marco de trabajo es de cumplimiento obligatorio durante todo el desarrollo
del aplicativo. Todas las implementaciones deben respetar este protocolo de
interacción con la IA y quedar reflejadas en el código y la documentación del
repositorio.


---

## 6. Puerta de Calidad (Quality Gate) y Protocolo de Prevención

Antes de realizar cualquier commit (`git commit`), el desarrollador DEBE utilizar la IA para auditar el código generado o modificado. Este paso actúa como una "Puerta de Calidad" obligatoria.

### Protocolo de Verificación Pre-Commit:

1.  **Revisión de SOLID y Clean Code:**
    *   Solicitar a la IA que analice los archivos modificados en busca de violaciones a los principios SOLID (especialmente SRP y OCP).
    *   Verificar que no existan *code smells* (funciones largas, anidamiento excesivo, nombres poco claros).

2.  **Verificación de Patrones:**
    *   Confirmar que la implementación respeta los patrones de diseño definidos (Strategy, Chain of Responsibility, Facade, Singleton, Adapter).

3.  **Ejecución de Pruebas:**
    *   Solicitar a la IA la generación o ejecución de scripts de prueba (unitarios, integración y E2E) para validar que los cambios no rompen la funcionalidad existente.
    *   Verificar que la cobertura de pruebas se mantenga o aumente.

4.  **Aprobación:**
    *   Solo si la IA confirma que el código cumple con los estándares y las pruebas pasan, se procede al commit.
    *   Si la IA detecta problemas, se debe iterar (refactorizar) y volver a verificar.
