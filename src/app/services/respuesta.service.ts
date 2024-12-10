import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RespuestaService {
  private respuestas: { [key: string]: string[] } = {
    'debilidades': [],
    'oportunidades': [],
    'fortalezas': [],
    'amenazas': []
  };

  private respuestasSubject = new BehaviorSubject(this.respuestas);
  respuestas$ = this.respuestasSubject.asObservable();

  agregarRespuesta(pregunta: string, respuesta: string) {
    if (this.respuestas[pregunta]) {
      this.respuestas[pregunta].push(respuesta);
      this.respuestasSubject.next(this.respuestas);
    }
  }

  obtenerRespuestasPorPregunta() {
    return this.respuestas;
  }

  obtenerDistribucionRespuestas(pregunta: string): { [respuesta: string]: number } {
    const respuestas = this.respuestas[pregunta];
    const distribucion: { [respuesta: string]: number } = {};

    respuestas.forEach(respuesta => {
      distribucion[respuesta] = (distribucion[respuesta] || 0) + 1;
    });

    return distribucion;
  }
}

