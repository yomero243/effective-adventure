/**
 * Service Worker Type Definitions - Camino Robusto
 * 
 * Declaración completa de tipos para Service Workers que extiende
 * correctamente el contexto WebWorker con APIs específicas.
 */

// Declaración global que extiende los tipos base de WebWorker
declare global {
  /**
   * ExtendableEvent - Evento base para Service Workers
   * Permite extender la duración del evento con waitUntil()
   */
  interface ExtendableEvent extends Event {
    waitUntil(promise: Promise<any>): void;
  }

  /**
   * FetchEvent - Evento de interceptación de requests HTTP
   */
  interface FetchEvent extends ExtendableEvent {
    readonly clientId: string;
    readonly handled: Promise<void>;
    readonly preloadResponse: Promise<Response | undefined>;
    readonly request: Request;
    readonly resultingClientId: string;
    respondWith(response: Promise<Response> | Response): void;
  }

  /**
   * InstallEvent - Evento de instalación del Service Worker
   */
  interface InstallEvent extends ExtendableEvent {}

  /**
   * ActivateEvent - Evento de activación del Service Worker
   */
  interface ActivateEvent extends ExtendableEvent {}

  /**
   * Mapa de eventos específicos para Service Workers
   */
  interface ServiceWorkerGlobalScopeEventMap extends WorkerGlobalScopeEventMap {
    'install': InstallEvent;
    'activate': ActivateEvent;
    'fetch': FetchEvent;
  }

  /**
   * ServiceWorkerGlobalScope - Contexto global del Service Worker
   * Reemplaza completamente la definición para incluir eventos específicos
   */
  interface ServiceWorkerGlobalScope extends WorkerGlobalScope {
    readonly clients: Clients;
    readonly registration: ServiceWorkerRegistration;
    readonly serviceWorker: ServiceWorker;
    
    // Event listeners tipados específicamente para Service Workers
    addEventListener<K extends keyof ServiceWorkerGlobalScopeEventMap>(
      type: K,
      listener: (this: ServiceWorkerGlobalScope, ev: ServiceWorkerGlobalScopeEventMap[K]) => any,
      options?: boolean | AddEventListenerOptions
    ): void;
    
    addEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ): void;

    removeEventListener<K extends keyof ServiceWorkerGlobalScopeEventMap>(
      type: K,
      listener: (this: ServiceWorkerGlobalScope, ev: ServiceWorkerGlobalScopeEventMap[K]) => any,
      options?: boolean | EventListenerOptions
    ): void;
    
    removeEventListener(
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | EventListenerOptions
    ): void;

    skipWaiting(): Promise<void>;
  }

  // Redeclaramos 'self' para que apunte al ServiceWorkerGlobalScope correcto
  const self: ServiceWorkerGlobalScope;
}

// Exportamos para que sea un módulo TypeScript válido
export {};