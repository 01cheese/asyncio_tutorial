## **Capítulo 8: Manejo de Excepciones en Código Asíncrono**

### **8.1. Introducción al Manejo de Excepciones en Programación Asíncrona**

En la programación asíncrona, el manejo de excepciones juega un papel crucial para garantizar la confiabilidad y la resiliencia de las aplicaciones. Dado que el código asíncrono a menudo se ejecuta de manera concurrente e interactúa con recursos externos como redes o archivos, la probabilidad de errores aumenta. Un manejo adecuado de excepciones ayuda a prevenir fallos en la aplicación, gestionar errores de manera elegante y asegurar la terminación correcta de las tareas.

### **8.2. Fundamentos del Manejo de Excepciones en Código Asíncrono**

En Python, el manejo de excepciones se realiza utilizando la estructura `try-except`. En el código asíncrono, este constructo se aplica de manera similar al código síncrono, pero con algunas sutilezas relacionadas con la asincronía.

#### **8.2.1. Estructura Básica de `try-except`**

```python
import asyncio

async def faulty_task():
    try:
        print("Inicio de la ejecución de la tarea")
        await asyncio.sleep(1)
        raise ValueError("Ocurrió un error en la tarea")
    except ValueError as e:
        print(f"Excepción capturada: {e}")
    finally:
        print("Finalización de la tarea")

async def main():
    await faulty_task()

if __name__ == "__main__":
    asyncio.run(main())
```

**Salida:**
```
Inicio de la ejecución de la tarea
Excepción capturada: Ocurrió un error en la tarea
Finalización de la tarea
```

En este ejemplo, la función asíncrona `faulty_task` lanza un `ValueError`, el cual es capturado por el bloque `except`. El bloque `finally` se ejecuta independientemente de si ocurrió una excepción, asegurando que la tarea finalice correctamente.

#### **8.2.2. Manejo de Múltiples Tipos de Excepciones**

Puedes manejar diferentes tipos de excepciones añadiendo bloques `except` adicionales.

```python
import asyncio

async def multiple_exceptions():
    try:
        await asyncio.sleep(1)
        # Lanzando diferentes excepciones
        raise ValueError("Valor inválido")
    except ValueError as ve:
        print(f"Manejada ValueError: {ve}")
    except TypeError as te:
        print(f"Manejada TypeError: {te}")
    except Exception as e:
        print(f"Manejada excepción general: {e}")
    finally:
        print("Finalización del manejo de excepciones")

async def main():
    await multiple_exceptions()

if __name__ == "__main__":
    asyncio.run(main())
```

**Salida:**
```
Manejada ValueError: Valor inválido
Finalización del manejo de excepciones
```

En este ejemplo, la función `multiple_exceptions` puede manejar varios tipos de excepciones, proporcionando una gestión de errores más detallada.

### **8.3. Excepciones en `asyncio.gather`**

La función `asyncio.gather` se utiliza para ejecutar múltiples corrutinas de manera concurrente. Por defecto, si una de las corrutinas lanza un error, `asyncio.gather` levantará una excepción y la ejecución de las demás corrutinas será cancelada. Sin embargo, puedes alterar este comportamiento utilizando el parámetro `return_exceptions`.

#### **8.3.1. Comportamiento Predeterminado**

```python
import asyncio

async def task_success():
    await asyncio.sleep(1)
    print("Tarea completada exitosamente")
    return "Éxito"

async def task_failure():
    await asyncio.sleep(2)
    raise RuntimeError("Error en la tarea")

async def main():
    try:
        results = await asyncio.gather(task_success(), task_failure())
    except RuntimeError as e:
        print(f"Excepción desde gather: {e}")

if __name__ == "__main__":
    asyncio.run(main())
```

**Salida:**
```
Tarea completada exitosamente
Excepción desde gather: Error en la tarea
```

En este ejemplo, a pesar de que la primera tarea se completa exitosamente, el error en la segunda tarea hace que `asyncio.gather` levante un `RuntimeError`.

#### **8.3.2. Manejo de Excepciones con `return_exceptions=True`**

Si configuras `return_exceptions=True`, `asyncio.gather` retornará todos los resultados, incluyendo las excepciones, en lugar de levantar la primera excepción encontrada.

```python
import asyncio

async def task_success():
    await asyncio.sleep(1)
    print("Tarea completada exitosamente")
    return "Éxito"

async def task_failure():
    await asyncio.sleep(2)
    raise RuntimeError("Error en la tarea")

async def main():
    results = await asyncio.gather(task_success(), task_failure(), return_exceptions=True)
    for result in results:
        if isinstance(result, Exception):
            print(f"Excepción recibida: {result}")
        else:
            print(f"Resultado: {result}")

if __name__ == "__main__":
    asyncio.run(main())
```

**Salida:**
```
Tarea completada exitosamente
Excepción recibida: Error en la tarea
Resultado: Éxito
```

En este ejemplo, ambas tareas se completan de manera independiente, y todos los resultados (incluyendo las excepciones) están disponibles para un procesamiento posterior.

### **8.4. Excepciones en Tareas de Fondo**

Las tareas de fondo (`asyncio.create_task`) pueden terminar con errores que no siempre son manejados explícitamente. Si una excepción en una tarea de fondo no es manejada, puede llevar a advertencias y potenciales fugas de recursos.

#### **8.4.1. Ejemplo de una Excepción No Manejada en una Tarea de Fondo**

```python
import asyncio

async def faulty_task():
    await asyncio.sleep(1)
    raise ValueError("Error en la tarea de fondo")

async def main():
    task = asyncio.create_task(faulty_task())
    await asyncio.sleep(2)

if __name__ == "__main__":
    asyncio.run(main())
```

**Salida:**
```
Exception in callback _ProactorBasePipeTransport._loop_callback()
handle: <Handle _ProactorBasePipeTransport._loop_callback()>
Traceback (most recent call last):
  File "C:\Python39\lib\asyncio\base_events.py", line 1822, in _run
    self._context.run(self._callback, *self._args)
  File "C:\Python39\lib\asyncio\windows_events.py", line 142, in _loop_callback
    self._callback(*self._args)
  File "C:\Python39\lib\asyncio\windows_events.py", line 255, in _add_writer
    self._add_to_selector(fd, selectors.EVENT_WRITE, callback)
  File "C:\Python39\lib\selectors.py", line 507, in register
    key = self._selector.register(fileobj, events, data)
ValueError: unsupported operation on closed file.
```

Esta advertencia indica que la excepción en la tarea de fondo no fue manejada.

#### **8.4.2. Manejo Adecuado de Excepciones en Tareas de Fondo**

Para evitar estos problemas, debes manejar explícitamente las excepciones en las tareas de fondo.

**Ejemplo:**

```python
import asyncio

async def faulty_task():
    try:
        await asyncio.sleep(1)
        raise ValueError("Error en la tarea de fondo")
    except ValueError as e:
        print(f"Excepción en la tarea de fondo manejada: {e}")

async def main():
    task = asyncio.create_task(faulty_task())
    await asyncio.sleep(2)

if __name__ == "__main__":
    asyncio.run(main())
```

**Salida:**
```
Excepción en la tarea de fondo manejada: Error en la tarea de fondo
```

En este ejemplo, la excepción dentro de la tarea de fondo es manejada dentro de la propia tarea, evitando excepciones no manejadas.

### **8.5. Uso de `asyncio.shield` para Proteger Corrutinas de Cancelación y Errores**

`asyncio.shield` permite proteger una corrutina de ser cancelada o afectada por errores externos, asegurando que su ejecución continúe independientemente de las condiciones externas.

#### **8.5.1. Ejemplo de Uso de `asyncio.shield`**

```python
import asyncio

async def critical_task():
    try:
        print("Tarea crítica iniciada")
        await asyncio.sleep(3)
        print("Tarea crítica completada")
    except asyncio.CancelledError:
        print("Tarea crítica fue cancelada")

async def main():
    task = asyncio.create_task(asyncio.shield(critical_task()))
    await asyncio.sleep(1)
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        print("La tarea fue cancelada, pero shield protegió la tarea crítica")

if __name__ == "__main__":
    asyncio.run(main())
```

**Salida:**
```
Tarea crítica iniciada
La tarea fue cancelada, pero shield protegió la tarea crítica
Tarea crítica completada
```

En este ejemplo, al usar `asyncio.shield`, la cancelación de la tarea principal no afecta a la `critical_task`, permitiendo que esta última continúe y se complete exitosamente.

#### **8.5.2. Aplicando `asyncio.shield` para Gestionar Ciclos de Vida de Tareas**

`asyncio.shield` es útil cuando deseas asegurar que ciertas corrutinas se ejecuten hasta su finalización, incluso si el bucle de eventos principal encuentra errores o cancela tareas.

### **8.6. Gestores de Contexto para Manejo de Excepciones**

Los gestores de contexto permiten gestionar recursos y asegurar su liberación adecuada incluso en caso de excepciones.

#### **8.6.1. Uso de `async with` para Manejo de Excepciones**

```python
import asyncio

class AsyncResource:
    async def __aenter__(self):
        print("Recurso abierto")
        return self

    async def __aexit__(self, exc_type, exc, tb):
        if exc:
            print(f"Excepción: {exc}")
        print("Recurso cerrado")
        return False  # Propagar excepción

async def main():
    try:
        async with AsyncResource() as resource:
            print("Usando el recurso")
            raise RuntimeError("Error al usar el recurso")
    except RuntimeError as e:
        print(f"Excepción capturada en main: {e}")

if __name__ == "__main__":
    asyncio.run(main())
```

**Salida:**
```
Recurso abierto
Usando el recurso
Excepción: Error al usar el recurso
Recurso cerrado
Excepción capturada en main: Error al usar el recurso
```

En este ejemplo, el gestor de contexto `AsyncResource` asegura que el recurso se cierre adecuadamente incluso cuando ocurre una excepción dentro del bloque `async with`.

### **8.7. Registro de Excepciones**

Utilizar el módulo `logging` para registrar excepciones es una buena práctica, especialmente en aplicaciones grandes y complejas.

#### **8.7.1. Configuración de Logging**

```python
import asyncio
import logging

# Configuración de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def faulty_task():
    await asyncio.sleep(1)
    raise ValueError("Ocurrió un error en la tarea")

async def main():
    try:
        await faulty_task()
    except ValueError as e:
        logger.error(f"Excepción capturada en main: {e}")

if __name__ == "__main__":
    asyncio.run(main())
```

**Salida:**
```
ERROR:__main__:Excepción capturada en main: Ocurrió un error en la tarea
```

En este ejemplo, la excepción es registrada con el nivel `ERROR`, lo que permite rastrear errores dentro de la aplicación.

#### **8.7.2. Registro de Excepciones en Tareas de Fondo**

```python
import asyncio
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def faulty_task():
    await asyncio.sleep(1)
    raise ValueError("Error en la tarea de fondo")

async def main():
    task = asyncio.create_task(faulty_task())

    try:
        await task
    except Exception as e:
        logger.exception("Excepción en la tarea de fondo")

if __name__ == "__main__":
    asyncio.run(main())
```

**Salida:**
```
ERROR:__main__:Excepción en la tarea de fondo
Traceback (most recent call last):
  File "async_exception.py", line 9, in faulty_task
    raise ValueError("Error en la tarea de fondo")
ValueError: Error en la tarea de fondo
```

Usar `logger.exception` incluye automáticamente el rastro de la pila, lo que facilita la depuración.

### **8.8. Ejemplos Prácticos de Manejo de Excepciones**

#### **8.8.1. Cliente HTTP Asíncrono con Manejo de Errores**

```python
import asyncio
import aiohttp
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def fetch(session, url):
    try:
        async with session.get(url, timeout=5) as response:
            response.raise_for_status()
            data = await response.text()
            logger.info(f"Descargado {url} con {len(data)} caracteres")
            return data
    except aiohttp.ClientError as e:
        logger.error(f"Error al solicitar {url}: {e}")
    except asyncio.TimeoutError:
        logger.error(f"Tiempo de espera agotado al solicitar {url}")

async def main():
    urls = [
        'https://www.example.com',
        'https://www.nonexistenturl.com',
        'https://httpbin.org/delay/6',  # Tiempo de espera
    ]
    async with aiohttp.ClientSession() as session:
        tasks = [fetch(session, url) for url in urls]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        for result in results:
            if isinstance(result, Exception):
                logger.error(f"Excepción recibida: {result}")
            elif result:
                logger.info(f"Resultado: {result[:100]}...")

if __name__ == "__main__":
    asyncio.run(main())
```

**Salida:**
```
INFO:__main__:Descargado https://www.example.com con 1256 caracteres
ERROR:__main__:Error al solicitar https://www.nonexistenturl.com: Cannot connect to host www.nonexistenturl.com:443 ssl:default [Name or service not known]
ERROR:__main__:Tiempo de espera agotado al solicitar https://httpbin.org/delay/6
ERROR:__main__:Excepción recibida: Cannot connect to host www.nonexistenturl.com:443 ssl:default [Name or service not known]
ERROR:__main__:Excepción recibida: Tiempo de espera agotado al solicitar https://httpbin.org/delay/6
INFO:__main__:Resultado: <HTML>...
```

En este ejemplo, un cliente HTTP asíncrono realiza solicitudes a múltiples URLs, manejando varios tipos de errores como hosts no disponibles y tiempos de espera agotados.

#### **8.8.2. Servidor Web Asíncrono con Manejo de Errores**

```python
from aiohttp import web
import asyncio
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def handle(request):
    try:
        data = await request.json()
        if 'value' not in data:
            raise web.HTTPBadRequest(text="Falta el campo 'value'")
        result = int(data['value']) * 2
        return web.json_response({"result": result})
    except web.HTTPException as e:
        raise e
    except Exception as e:
        logger.exception("Excepción no manejada")
        raise web.HTTPInternalServerError(text="Error interno del servidor")

app = web.Application()
app.add_routes([web.post('/multiply', handle)])

if __name__ == '__main__':
    web.run_app(app, host='127.0.0.1', port=8080)
```

**Descripción:**

- El servidor escucha solicitudes POST en la ruta `/multiply`.
- Espera datos JSON con un campo `value`.
- Si falta el campo `value`, retorna un error `400 Bad Request`.
- Si ocurre cualquier otro error, registra la excepción y retorna un error `500 Internal Server Error`.

**Ejemplos de Solicitudes Usando `curl`:**

```bash
curl -X POST -H "Content-Type: application/json" -d '{"value": 10}' http://127.0.0.1:8080/multiply
```

**Respuesta:**
```json
{
  "result": 20
}
```

**Ejemplo de Solicitud Falta del Campo `value`:**

```bash
curl -X POST -H "Content-Type: application/json" -d '{"number": 10}' http://127.0.0.1:8080/multiply
```

**Respuesta:**
```
Falta el campo 'value'
```

### **8.9. Consejos y Recomendaciones para el Manejo de Excepciones**

#### **8.9.1. Manejar Excepciones Específicas Antes que Generales**

Siempre maneja excepciones más específicas antes que las generales. Esto permite una gestión de errores más precisa y proporciona mensajes más detallados.

```python
try:
    # Código que puede lanzar excepciones
    pass
except ValueError:
    # Manejar ValueError
    pass
except Exception:
    # Manejar todas las demás excepciones
    pass
```

#### **8.9.2. Usar `finally` para la Limpieza de Recursos**

El bloque `finally` asegura que el código se ejecute independientemente de si ocurrió una excepción, lo que es útil para liberar recursos.

```python
async def process():
    try:
        resource = await acquire_resource()
        # Trabajar con el recurso
    except Exception as e:
        logger.error(f"Error: {e}")
    finally:
        await release_resource(resource)
```

#### **8.9.3. No Suprimir Excepciones Innecesariamente**

Evita usar bloques `except` vacíos que suprimen todas las excepciones sin manejarlas. Esto puede dificultar la depuración y llevar a errores ocultos.

```python
# Malo:
try:
    # Código
    pass
except:
    pass

# Bueno:
try:
    # Código
    pass
except SpecificException as e:
    # Manejar excepción específica
    pass
```

#### **8.9.4. Registrar Excepciones para la Depuración**

Usa el módulo `logging` para registrar excepciones, lo que facilita el seguimiento y la depuración.

```python
import logging

logger = logging.getLogger(__name__)

try:
    # Código que puede lanzar una excepción
    pass
except Exception as e:
    logger.exception("Ocurrió un error")
```

### **8.10. Conclusión**

El manejo de excepciones en la programación asíncrona con Python requiere una consideración cuidadosa para asegurar la confiabilidad y la resiliencia de las aplicaciones. El uso adecuado de los constructos `try-except`, la gestión de excepciones en tareas de fondo, la utilización de `asyncio.shield` para proteger corrutinas críticas, y la aplicación de gestores de contexto permiten una gestión efectiva de errores y previenen fallos en la aplicación.

Al seguir las mejores prácticas y utilizar las herramientas adecuadas, puedes crear aplicaciones asíncronas robustas que manejan errores de manera eficiente y mantienen la integridad de los datos incluso en entornos complejos y concurrentes.