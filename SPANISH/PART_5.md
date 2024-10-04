## **Capítulo 5: Trabajando con el Módulo `asyncio`**

### **5.1. Introducción a `asyncio`**

`asyncio` es una biblioteca estándar de Python que proporciona herramientas para escribir código asíncrono. Está construida alrededor del concepto de un bucle de eventos, que gestiona la ejecución de corrutinas, el manejo de eventos y las tareas asíncronas. `asyncio` permite la creación de aplicaciones de alto rendimiento y escalables al utilizar eficientemente los recursos del sistema.

#### **5.1.1. Historia y Contexto**

La programación asíncrona en Python se implementó inicialmente utilizando hilos y procesos. Sin embargo, estos enfoques tenían sus limitaciones, como la sobrecarga del cambio de contexto y las complejidades relacionadas con la sincronización de datos. La introducción del módulo `asyncio` en Python 3.4 marcó un avance significativo, ofreciendo una manera más ligera y eficiente de gestionar tareas asíncronas.

### **5.2. Bucle de Eventos**

El bucle de eventos es la piedra angular de la programación asíncrona en `asyncio`. Gestiona la ejecución de corrutinas, maneja eventos y coordina operaciones asíncronas.

#### **5.2.1. ¿Qué es un Bucle de Eventos?**

Un bucle de eventos es un bucle infinito que ejecuta tareas a medida que están listas. Maneja corrutinas, programa su ejecución y gestiona operaciones asíncronas como solicitudes de red u operaciones de E/S.

#### **5.2.2. Crear y Ejecutar un Bucle de Eventos**

Existen varias maneras de crear y ejecutar un bucle de eventos en `asyncio`. Exploremos los métodos más comunes.

**Usando `asyncio.run` (Python 3.7+)**

`asyncio.run` es una función conveniente que crea automáticamente un bucle de eventos, ejecuta una corrutina y cierra el bucle al finalizar.

```python
import asyncio

async def main():
    print("¡Hola desde asyncio.run!")
    await asyncio.sleep(1)
    print("¡Adiós desde asyncio.run!")

if __name__ == "__main__":
    asyncio.run(main())
```

**Salida:**
```
¡Hola desde asyncio.run!
¡Adiós desde asyncio.run!
```

**Gestión Manual del Bucle de Eventos**

En versiones anteriores de Python o para escenarios más complejos, puedes gestionar el bucle de eventos manualmente.

```python
import asyncio

async def main():
    print("¡Hola desde el bucle de eventos manual!")
    await asyncio.sleep(1)
    print("¡Adiós desde el bucle de eventos manual!")

# Creando el bucle de eventos
loop = asyncio.get_event_loop()

# Ejecutando la corrutina
try:
    loop.run_until_complete(main())
finally:
    loop.close()
```

**Salida:**
```
¡Hola desde el bucle de eventos manual!
¡Adiós desde el bucle de eventos manual!
```

#### **5.2.3. Reutilización del Bucle de Eventos**

Cuando trabajas en entornos donde el bucle de eventos ya está en ejecución (por ejemplo, en Jupyter Notebook), usar `asyncio.run` puede llevar a errores. En tales casos, se recomienda utilizar el bucle de eventos existente.

```python
import asyncio

async def greet():
    print("¡Hola desde el bucle de eventos existente!")
    await asyncio.sleep(1)
    print("¡Adiós desde el bucle de eventos existente!")

# Obteniendo el bucle de eventos existente
loop = asyncio.get_event_loop()

# Ejecutando la corrutina
loop.create_task(greet())

# Ejecutando el bucle de eventos indefinidamente
loop.run_forever()
```

**Salida:**
```
¡Hola desde el bucle de eventos existente!
¡Adiós desde el bucle de eventos existente!
```

### **5.3. Corrutinas y Tareas**

Las corrutinas y las tareas son conceptos fundamentales en `asyncio` que facilitan las operaciones asíncronas.

#### **5.3.1. Corrutinas**

Las corrutinas son funciones definidas usando `async def` que pueden pausar y reanudar su ejecución usando `await`. Permiten escribir código asíncrono no bloqueante.

**Ejemplo de una Corrutina:**

```python
import asyncio

async def say_hello():
    print("Hola")
    await asyncio.sleep(1)
    print("Mundo")

async def main():
    await say_hello()

if __name__ == "__main__":
    asyncio.run(main())
```

**Salida:**
```
Hola
Mundo
```

#### **5.3.2. Tareas**

Las tareas son corrutinas programadas que permiten que múltiples corrutinas se ejecuten concurrentemente. Permiten la ejecución paralela de operaciones asíncronas y su gestión.

**Creando una Tarea:**

```python
import asyncio

async def say_after(delay, message):
    await asyncio.sleep(delay)
    print(message)

async def main():
    task1 = asyncio.create_task(say_after(1, "Tarea 1 completada"))
    task2 = asyncio.create_task(say_after(2, "Tarea 2 completada"))

    print("Tareas creadas")
    await task1
    await task2
    print("Todas las tareas completadas")

if __name__ == "__main__":
    asyncio.run(main())
```

**Salida:**
```
Tareas creadas
Tarea 1 completada
Tarea 2 completada
Todas las tareas completadas
```

**Ejecución Paralela de Tareas con `asyncio.gather`:**

```python
import asyncio

async def task1():
    await asyncio.sleep(1)
    print("Tarea 1 completada")

async def task2():
    await asyncio.sleep(2)
    print("Tarea 2 completada")

async def main():
    await asyncio.gather(task1(), task2())
    print("Todas las tareas completadas")

if __name__ == "__main__":
    asyncio.run(main())
```

**Salida:**
```
Tarea 1 completada
Tarea 2 completada
Todas las tareas completadas
```

### **5.4. Futuras y Callbacks**

`Future` es un objeto de bajo nivel que representa el resultado de una operación asíncrona. `asyncio` utiliza `Future` para gestionar el estado de corrutinas y tareas.

#### **5.4.1. ¿Qué es un Future?**

Un `Future` es un objeto que contiene el resultado de una operación asíncrona, el cual puede estar disponible en el futuro. Permite rastrear el estado de la operación y obtener el resultado una vez que está listo.

**Ejemplo de Uso de un Future:**

```python
import asyncio

async def set_future(fut):
    await asyncio.sleep(1)
    fut.set_result("Resultado del Future")

async def main():
    loop = asyncio.get_event_loop()
    fut = loop.create_future()
    asyncio.create_task(set_future(fut))
    result = await fut
    print(result)

if __name__ == "__main__":
    asyncio.run(main())
```

**Salida:**
```
Resultado del Future
```

#### **5.4.2. Uso de Callbacks con Futures**

Un callback es una función que se llama cuando un `Future` se completa. Esto permite reaccionar ante la finalización de una operación asíncrona.

**Ejemplo de Uso de un Callback:**

```python
import asyncio

def callback(fut):
    print(f"Callback: {fut.result()}")

async def set_future(fut):
    await asyncio.sleep(1)
    fut.set_result("Resultado del Future con Callback")

async def main():
    loop = asyncio.get_running_loop()
    fut = loop.create_future()
    fut.add_done_callback(callback)
    asyncio.create_task(set_future(fut))
    await fut

if __name__ == "__main__":
    asyncio.run(main())
```

**Salida:**
```
Callback: Resultado del Future con Callback
```

### **5.5. Colas Asíncronas**

Las colas asíncronas facilitan el intercambio de datos entre corrutinas. Son particularmente útiles para crear hilos de trabajo o procesadores de tareas.

#### **5.5.1. Crear y Usar una Cola Asíncrona**

**Ejemplo Usando `asyncio.Queue`:**

```python
import asyncio

async def producer(queue, n):
    for i in range(n):
        item = f"item_{i}"
        await queue.put(item)
        print(f"Productor añadió: {item}")
        await asyncio.sleep(1)
    await queue.put(None)  # Señal de terminación

async def consumer(queue):
    while True:
        item = await queue.get()
        if item is None:
            break
        print(f"Consumidor procesó: {item}")
        await asyncio.sleep(2)
    print("El consumidor ha terminado de trabajar")

async def main():
    queue = asyncio.Queue()
    await asyncio.gather(
        producer(queue, 5),
        consumer(queue)
    )

if __name__ == "__main__":
    asyncio.run(main())
```

**Salida:**
```
Productor añadió: item_0
Consumidor procesó: item_0
Productor añadió: item_1
Productor añadió: item_2
Consumidor procesó: item_1
Productor añadió: item_3
Productor añadió: item_4
Consumidor procesó: item_2
Consumidor procesó: item_3
Consumidor procesó: item_4
El consumidor ha terminado de trabajar
```

#### **5.5.2. Ventajas de las Colas Asíncronas**

- **Seguridad de Hilos:** Las colas asíncronas proporcionan un intercambio de datos seguro entre corrutinas sin necesidad de sincronización explícita.
- **Flexibilidad:** Permiten escalar fácilmente el número de productores y consumidores.
- **Eficiencia:** Las colas asíncronas gestionan de manera eficiente las tareas y recursos.

### **5.6. Gestores de Contexto Asíncronos**

Los gestores de contexto asíncronos permiten la gestión de recursos dentro de un contexto asíncrono, asegurando la correcta adquisición y liberación de recursos.

#### **5.6.1. Crear un Gestor de Contexto Asíncrono**

Los gestores de contexto asíncronos se implementan usando `async with`.

**Ejemplo:**

```python
import asyncio

class AsyncContextManager:
    async def __aenter__(self):
        print("Contexto asíncrono: Entrada")
        await asyncio.sleep(1)
        return self

    async def __aexit__(self, exc_type, exc, tb):
        await asyncio.sleep(1)
        print("Contexto asíncrono: Salida")

    async def do_something(self):
        print("Contexto asíncrono: Realizando acción")
        await asyncio.sleep(1)

async def main():
    async with AsyncContextManager() as manager:
        await manager.do_something()

if __name__ == "__main__":
    asyncio.run(main())
```

**Salida:**
```
Contexto asíncrono: Entrada
Contexto asíncrono: Realizando acción
Contexto asíncrono: Salida
```

#### **5.6.2. Usar Gestores de Contexto Asíncronos con Bibliotecas**

Muchas bibliotecas asíncronas proporcionan sus propios gestores de contexto asíncronos para gestionar recursos como conexiones de red o descriptores de archivos.

**Ejemplo Usando `aiohttp.ClientSession`:**

```python
import aiohttp
import asyncio

async def fetch(session, url):
    async with session.get(url) as response:
        return await response.text()

async def main():
    async with aiohttp.ClientSession() as session:
        html = await fetch(session, 'https://www.example.com')
        print(html)

if __name__ == "__main__":
    asyncio.run(main())
```

### **5.7. Sincronización en `asyncio`**

La programación asíncrona requiere gestionar el acceso a recursos compartidos. `asyncio` proporciona varios primitivos de sincronización para este propósito.

#### **5.7.1. Lock**

Un lock se usa para asegurar el acceso exclusivo a un recurso.

**Ejemplo Usando `asyncio.Lock`:**

```python
import asyncio

async def worker(name, lock):
    print(f"Trabajador {name} está intentando adquirir el lock...")
    async with lock:
        print(f"Trabajador {name} ha adquirido el lock.")
        await asyncio.sleep(2)
    print(f"Trabajador {name} ha liberado el lock.")

async def main():
    lock = asyncio.Lock()
    await asyncio.gather(
        worker("A", lock),
        worker("B", lock)
    )

if __name__ == "__main__":
    asyncio.run(main())
```

**Salida:**
```
Trabajador A está intentando adquirir el lock...
Trabajador A ha adquirido el lock.
Trabajador B está intentando adquirir el lock...
Trabajador A ha liberado el lock.
Trabajador B ha adquirido el lock.
Trabajador B ha liberado el lock.
```

#### **5.7.2. Semáforo**

Un semáforo limita el número de corrutinas que pueden acceder a un recurso simultáneamente.

**Ejemplo Usando `asyncio.Semaphore`:**

```python
import asyncio

async def worker(name, semaphore):
    async with semaphore:
        print(f"Trabajador {name} ha obtenido acceso.")
        await asyncio.sleep(2)
    print(f"Trabajador {name} ha liberado acceso.")

async def main():
    semaphore = asyncio.Semaphore(2)  # Máximo 2 simultáneamente
    await asyncio.gather(
        worker("A", semaphore),
        worker("B", semaphore),
        worker("C", semaphore),
        worker("D", semaphore)
    )

if __name__ == "__main__":
    asyncio.run(main())
```

**Salida:**
```
Trabajador A ha obtenido acceso.
Trabajador B ha obtenido acceso.
Trabajador C está intentando obtener acceso...
Trabajador D está intentando obtener acceso...
Trabajador A ha liberado acceso.
Trabajador C ha obtenido acceso.
Trabajador B ha liberado acceso.
Trabajador D ha obtenido acceso.
Trabajador C ha liberado acceso.
Trabajador D ha liberado acceso.
```

#### **5.7.3. Evento**

Un evento permite que corrutinas esperen a que ocurra un evento específico.

**Ejemplo Usando `asyncio.Event`:**

```python
import asyncio

async def waiter(event, name):
    print(f"Esperador {name} está esperando el evento...")
    await event.wait()
    print(f"Esperador {name} ha recibido el evento!")

async def setter(event):
    await asyncio.sleep(2)
    print("Estableciendo el evento.")
    event.set()

async def main():
    event = asyncio.Event()
    await asyncio.gather(
        waiter(event, "A"),
        waiter(event, "B"),
        setter(event)
    )

if __name__ == "__main__":
    asyncio.run(main())
```

**Salida:**
```
Esperador A está esperando el evento...
Esperador B está esperando el evento...
Estableciendo el evento.
Esperador A ha recibido el evento!
Esperador B ha recibido el evento!
```

### **5.8. Ejemplos del Mundo Real Usando `asyncio`**

Exploremos algunas aplicaciones del mundo real que utilizan `asyncio` para una gestión eficiente de tareas asíncronas.

#### **5.8.1. Scraping Web Asíncrono con `aiohttp` y `asyncio`**

En este ejemplo, crearemos un script para descargar múltiples páginas web de manera concurrente.

```python
import aiohttp
import asyncio

async def fetch(session, url):
    async with session.get(url) as response:
        content = await response.text()
        print(f"Descargado {url} con longitud de {len(content)} caracteres")
        return content

async def main():
    urls = [
        'https://www.example.com',
        'https://www.python.org',
        'https://www.asyncio.org'
    ]
    async with aiohttp.ClientSession() as session:
        tasks = [fetch(session, url) for url in urls]
        await asyncio.gather(*tasks)

if __name__ == "__main__":
    asyncio.run(main())
```

**Salida:**
```
Descargado https://www.example.com con longitud de 1256 caracteres
Descargado https://www.python.org con longitud de 5432 caracteres
Descargado https://www.asyncio.org con longitud de 3210 caracteres
```

#### **5.8.2. Servidor de Chat Asíncrono Usando `asyncio`**

Vamos a crear un servidor de chat sencillo que pueda manejar múltiples conexiones simultáneamente.

**Servidor:**

```python
import asyncio

clients = set()

async def handle_client(reader, writer):
    addr = writer.get_extra_info('peername')
    print(f"Nueva conexión: {addr}")
    clients.add(writer)
    try:
        while True:
            data = await reader.readline()
            if not data:
                break
            message = data.decode()
            print(f"Recibido de {addr}: {message.strip()}")
            for client in clients:
                if client != writer:
                    client.write(data)
                    await client.drain()
    except asyncio.IncompleteReadError:
        pass
    finally:
        print(f"Conexión cerrada: {addr}")
        clients.remove(writer)
        writer.close()
        await writer.wait_closed()

async def main():
    server = await asyncio.start_server(handle_client, '127.0.0.1', 8888)
    addr = server.sockets[0].getsockname()
    print(f"Servidor corriendo en {addr}")

    async with server:
        await server.serve_forever()

if __name__ == "__main__":
    asyncio.run(main())
```

**Cliente:**

```python
import asyncio

async def tcp_echo_client():
    reader, writer = await asyncio.open_connection('127.0.0.1', 8888)
    print("Conectado al servidor. Ingresa mensajes:")

    async def listen():
        while True:
            data = await reader.readline()
            if not data:
                break
            print(f"Recibido: {data.decode().strip()}")

    asyncio.create_task(listen())

    while True:
        message = await asyncio.get_event_loop().run_in_executor(None, input)
        writer.write(f"{message}\n".encode())
        await writer.drain()

    writer.close()
    await writer.wait_closed()

if __name__ == "__main__":
    asyncio.run(tcp_echo_client())
```

**Descripción:**

- **Servidor:** Acepta conexiones de clientes, las almacena en un conjunto `clients` y retransmite los mensajes recibidos a todos los clientes conectados excepto al remitente.
- **Cliente:** Se conecta al servidor, permite al usuario ingresar mensajes y escucha mensajes entrantes del servidor concurrentemente.

**Ejecución del Ejemplo:**

1. Ejecuta el script del servidor.
2. Ejecuta múltiples instancias del script del cliente.
3. Ingresa mensajes en un cliente; aparecerán en todos los demás clientes conectados.

**Salida de Ejemplo del Cliente:**
```
Conectado al servidor. Ingresa mensajes:
¡Hola a todos!
Recibido: ¡Hola a todos!
```

#### **5.8.3. Manejador de Archivos Asíncrono Usando `aiofiles`**

Crearemos un script para leer y escribir múltiples archivos de manera concurrente.

```python
import asyncio
import aiofiles

async def read_file(file_path):
    async with aiofiles.open(file_path, mode='r') as f:
        contents = await f.read()
        print(f"Contenido de {file_path}:\n{contents}\n")

async def write_file(file_path, content):
    async with aiofiles.open(file_path, mode='w') as f:
        await f.write(content)
        print(f"Escribió en {file_path}")

async def main():
    await asyncio.gather(
        write_file('file1.txt', 'Contenido del archivo 1'),
        write_file('file2.txt', 'Contenido del archivo 2'),
        write_file('file3.txt', 'Contenido del archivo 3'),
    )
    await asyncio.gather(
        read_file('file1.txt'),
        read_file('file2.txt'),
        read_file('file3.txt'),
    )

if __name__ == "__main__":
    asyncio.run(main())
```

**Salida:**
```
Escribió en file1.txt
Escribió en file2.txt
Escribió en file3.txt
Contenido de file1.txt:
Contenido del archivo 1

Contenido de file2.txt:
Contenido del archivo 2

Contenido de file3.txt:
Contenido del archivo 3
```

### **5.9. Mejores Prácticas al Trabajar con `asyncio`**

Para utilizar efectivamente el módulo `asyncio`, se recomienda adherirse a las siguientes mejores prácticas:

#### **5.9.1. Usar `asyncio.run` para Ejecutar Corrutinas**

`asyncio.run` proporciona una manera simple y fiable de ejecutar corrutinas, gestionando automáticamente el bucle de eventos.

**Ejemplo:**

```python
import asyncio

async def main():
    print("Ejecutando la corrutina principal")

if __name__ == "__main__":
    asyncio.run(main())
```

#### **5.9.2. Evitar Llamadas Bloqueantes**

Las llamadas bloqueantes, como `time.sleep` o cálculos intensivos, bloquean el bucle de eventos y degradan el rendimiento de la aplicación. En su lugar, usa contrapartes asíncronas (`asyncio.sleep`) o delega los cálculos a hilos o procesos separados.

**Incorrecto:**

```python
import asyncio
import time

async def blocking_task():
    print("Iniciando tarea bloqueante")
    time.sleep(2)  # Llamada bloqueante
    print("Tarea bloqueante completada")

async def main():
    await blocking_task()

if __name__ == "__main__":
    asyncio.run(main())
```

**Correcto:**

```python
import asyncio

async def non_blocking_task():
    print("Iniciando tarea no bloqueante")
    await asyncio.sleep(2)  # Sleep asíncrono
    print("Tarea no bloqueante completada")

async def main():
    await non_blocking_task()

if __name__ == "__main__":
    asyncio.run(main())
```

#### **5.9.3. Usar `async with` para Gestores de Contexto Asíncronos**

Los gestores de contexto asíncronos aseguran una correcta gestión de recursos dentro de un contexto asíncrono.

**Ejemplo:**

```python
import aiofiles
import asyncio

async def write_file(file_path, content):
    async with aiofiles.open(file_path, mode='w') as f:
        await f.write(content)
    print(f"Escribió en {file_path}")

async def main():
    await write_file('output.txt', '¡Hola, asyncio!')

if __name__ == "__main__":
    asyncio.run(main())
```

#### **5.9.4. Usar `asyncio.gather` para la Ejecución Concurrente de Corrutinas**

`asyncio.gather` permite ejecutar múltiples corrutinas concurrentemente y esperar a que todas se completen.

**Ejemplo:**

```python
import asyncio

async def task1():
    await asyncio.sleep(1)
    print("Tarea 1 completada")

async def task2():
    await asyncio.sleep(2)
    print("Tarea 2 completada")

async def main():
    await asyncio.gather(task1(), task2())
    print("Todas las tareas completadas")

if __name__ == "__main__":
    asyncio.run(main())
```

#### **5.9.5. Manejar Excepciones**

Maneja excepciones dentro de las corrutinas usando bloques `try-except` para asegurar la fiabilidad de la aplicación.

**Ejemplo:**

```python
import asyncio

async def faulty_task():
    await asyncio.sleep(1)
    raise ValueError("¡Ocurrió un error!")

async def main():
    try:
        await faulty_task()
    except ValueError as e:
        print(f"Excepción capturada: {e}")

if __name__ == "__main__":
    asyncio.run(main())
```

**Salida:**
```
Excepción capturada: ¡Ocurrió un error!
```

#### **5.9.6. Gestionar el Tiempo de Ejecución de las Tareas**

Usa `asyncio.wait_for` para establecer límites de tiempo en la ejecución de corrutinas, previniendo que la aplicación se quede colgada.

**Ejemplo:**

```python
import asyncio

async def long_task():
    await asyncio.sleep(5)
    print("Tarea larga completada")

async def main():
    try:
        await asyncio.wait_for(long_task(), timeout=3)
    except asyncio.TimeoutError:
        print("La tarea excedió el límite de tiempo y fue cancelada")

if __name__ == "__main__":
    asyncio.run(main())
```

**Salida:**
```
La tarea excedió el límite de tiempo y fue cancelada
```

### **5.10. Conclusión**

El módulo `asyncio` proporciona herramientas potentes para implementar programación asíncrona en Python. Comprender sus componentes centrales—bucle de eventos, corrutinas, tareas, Futures y primitivos de sincronización asíncrona—es esencial para construir aplicaciones eficientes y escalables. Al seguir las mejores prácticas y aprovechar ejemplos del mundo real, los desarrolladores pueden aprovechar todo el potencial de `asyncio` para crear software receptivo y de alto rendimiento.