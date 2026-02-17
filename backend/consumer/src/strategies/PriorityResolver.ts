import { IncidentType, Priority } from '../types';
import type { IPriorityStrategy } from './IPriorityStrategy';
import { CriticalServiceStrategy } from './CriticalServiceStrategy';
import { DegradedServiceStrategy } from './DegradedServiceStrategy';
import { MinorIssuesStrategy } from './MinorIssuesStrategy';
import { DefaultPriorityStrategy } from './DefaultPriorityStrategy';

/**
 * Orquesta la selección y ejecución de estrategias para el cálculo de prioridades.
 * Utiliza un Map para asociar Tipos de Incidente con su IPriorityStrategy correspondiente.
 * 
 * @class PriorityResolver
 */
export class PriorityResolver {


    private readonly strategies: Map<IncidentType, IPriorityStrategy>;
    private readonly fallback: IPriorityStrategy;

    /**
     * Inicializa el resolvedor con un conjunto de estrategias y una estrategia de respaldo (fallback).
     * 
     * @param {IPriorityStrategy[]} [strategies] Array opcional de estrategias a registrar.
     * @param {IPriorityStrategy} [fallback] Estrategia de respaldo opcional para tipos no mapeados.
     */
    constructor(
        strategies?: IPriorityStrategy[],
        fallback?: IPriorityStrategy
    ) {


        this.fallback = fallback ?? new DefaultPriorityStrategy();

        const allStrategies = strategies ?? [
            new CriticalServiceStrategy(),
            new DegradedServiceStrategy(),
            new MinorIssuesStrategy(),
        ];

        this.strategies = new Map();
        for (const strategy of allStrategies) {
            for (const type of strategy.supportedTypes) {
                this.strategies.set(type, strategy);
            }
        }
    }

    /**
     * Resuelve la prioridad para un tipo de incidente dado seleccionando la estrategia adecuada.
     * 
     * @param {IncidentType} type El tipo de incidente para el cual calcular la prioridad.
     * @returns {Priority} La prioridad calculada (HIGH, MEDIUM, LOW).
     */
    resolve(type: IncidentType): Priority {


        const strategy = this.strategies.get(type) ?? this.fallback;
        return strategy.calculate(type);
    }
}
