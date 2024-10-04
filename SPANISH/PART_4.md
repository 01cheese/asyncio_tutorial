## **Capítulo 4: Sintaxis de `async` y `await`**

### **4.1. Introducción a `async` y `await`**

Las palabras clave `async` y `await` son los componentes principales de la programación asíncrona en Python. Permiten a los desarrolladores escribir código que se ejecuta de manera asíncrona, haciéndolo más legible y manejable en comparación con los enfoques tradicionales basados en callbacks.

#### **4.1.1. Historia de `async` y `await`**

Antes de la introducción de `async` y `await` en Python 3.5, la programación asíncrona se implementaba utilizando generadores y bibliotecas especializadas como `asyncio`, `Twisted` y `gevent`. Este enfoque era poderoso pero complejo de entender y utilizar. La introducción de `async` y `await` simplificó significativamente la escritura de código asíncrono, haciéndolo similar a los estilos de programación sincrónicos.

### **4.2. La Palabra Clave `async`**

La palabra clave `async` se utiliza para declarar funciones asíncronas, también conocidas como corrutinas. Una función asíncrona es una función que puede pausar su ejecución y reanudarla más tarde, permitiendo que otras tareas se ejecuten en el ínterin.

#### **4.2.1. Sintaxis para Declarar una Función Asíncrona**

Una función asíncrona se declara utilizando la palabra clave `async` antes de `def`.

```python
async def mi_funcion_asincrona():
    pass
```

#### **4.2.2. Ejemplo de una Función Asíncrona Simple**

```python
import asyncio

async def saludar(nombre):
    print(f"¡Hola, {nombre}!")
    await asyncio.sleep(1)
    print(f"¡Adiós, {nombre}!")

# Ejecutando la corrutina
asyncio.run(saludar("Alicia"))
```

**Salida:**
```
¡Hola, Alicia!
¡Adiós, Alicia!
```

En este ejemplo, la función `saludar` es asíncrona. Imprime un saludo, espera 1 segundo y luego imprime una despedida. La palabra clave `await` permite que la corrutina pause su ejecución sin bloquear el hilo principal.

### **4.3. La Palabra Clave `await`**

La palabra clave `await` se utiliza para suspender la ejecución de una corrutina hasta que otra operación asíncrona se complete. Esto permite una gestión eficiente de las tareas asíncronas y evita el bloqueo.

#### **4.3.1. Sintaxis para Usar `await`**

```python
resultado = await alguna_funcion_asincrona()
```

#### **4.3.2. Ejemplo de Uso de `await`**

```python
import asyncio

async def obtener_datos():
    print("Iniciando la obtención de datos...")
    await asyncio.sleep(2)  # Simulando una operación asíncrona
    print("Datos obtenidos.")
    return {"datos": "Datos de muestra"}

async def procesar_datos(datos):
    print("Iniciando el procesamiento de datos...")
    await asyncio.sleep(1)  # Simulando procesamiento asíncrono
    print("Datos procesados.")
    return f"Resultado: {datos['datos']}"

async def main():
    datos = await obtener_datos()
    resultado = await procesar_datos(datos)
    print(resultado)

if __name__ == "__main__":
    asyncio.run(main())
```

**Salida:**
```
Iniciando la obtención de datos...
Datos obtenidos.
Iniciando el procesamiento de datos...
Datos procesados.
Resultado: Datos de muestra
```

En este ejemplo, `await` se utiliza para esperar la finalización de las funciones `obtener_datos` y `procesar_datos` sin bloquear el hilo principal.

### **4.4. Interacción Entre `async` y `await`**

`async` y `await` trabajan juntos para crear corrutinas asíncronas que pueden pausar y reanudar su ejecución. Esto permite escribir código asíncrono que parece y se lee como código sincrónico mientras se ejecuta de manera asíncrona.

#### **4.4.1. Cadena Asíncrona de Llamadas**

```python
import asyncio

async def tarea1():
    print("Tarea 1: Inicio")
    await asyncio.sleep(1)
    print("Tarea 1: Completa")
    return "Resultado de la Tarea 1"

async def tarea2():
    print("Tarea 2: Inicio")
    await asyncio.sleep(2)
    print("Tarea 2: Completa")
    return "Resultado de la Tarea 2"

async def main():
    resultado1 = await tarea1()
    resultado2 = await tarea2()
    print(resultado1)
    print(resultado2)

if __name__ == "__main__":
    asyncio.run(main())
```

**Salida:**
```
Tarea 1: Inicio
Tarea 1: Completa
Tarea 2: Inicio
Tarea 2: Completa
Resultado de la Tarea 1
Resultado de la Tarea 2
```

En este ejemplo, las tareas se ejecutan de forma secuencial a pesar de ser asíncronas. Para una ejecución paralela, se necesitan herramientas adicionales como `asyncio.gather`.

### **4.5. Crear y Ejecutar Corrutinas**

Las corrutinas pueden ejecutarse de diversas maneras dependiendo del contexto y los requisitos de la aplicación.

#### **4.5.1. Usando `asyncio.run`**

`asyncio.run` es una función conveniente disponible desde Python 3.7 en adelante que crea un bucle de eventos, ejecuta una corrutina y cierra el bucle al finalizar.

```python
import asyncio

async def decir_hola():
    print("¡Hola!")
    await asyncio.sleep(1)
    print("¡Mundo!")

asyncio.run(decir_hola())
```

**Salida:**
```
¡Hola!
¡Mundo!
```

#### **4.5.2. Uso Manual del Bucle de Eventos**

Para una gestión más flexible del bucle de eventos, puedes crearlo y gestionarlo manualmente.

```python
import asyncio

async def saludar(nombre):
    print(f"¡Hola, {nombre}!")
    await asyncio.sleep(1)
    print(f"¡Adiós, {nombre}!")

# Creando el bucle de eventos
loop = asyncio.get_event_loop()

# Ejecutando la corrutina
loop.run_until_complete(saludar("Roberto"))

# Cerrando el bucle de eventos
loop.close()
```

**Salida:**
```
¡Hola, Roberto!
¡Adiós, Roberto!
```

#### **4.5.3. Ejecutando Múltiples Corrutinas Simultáneamente con `asyncio.gather`**

`asyncio.gather` permite ejecutar múltiples corrutinas concurrentemente y esperar a que todas se completen.

```python
import asyncio

async def tarea1():
    await asyncio.sleep(1)
    print("Tarea 1 completada")

async def tarea2():
    await asyncio.sleep(2)
    print("Tarea 2 completada")

async def main():
    await asyncio.gather(tarea1(), tarea2())

if __name__ == "__main__":
    asyncio.run(main())
```

**Salida:**
```
Tarea 1 completada
Tarea 2 completada
```

En este ejemplo, ambas tareas comienzan simultáneamente, y el tiempo total de ejecución es aproximadamente 2 segundos en lugar de 3 segundos si se ejecutaran secuencialmente.

### **4.6. Ejemplos Prácticos del Uso de `async` y `await`**

Exploremos varios ejemplos prácticos que demuestran el uso de `async` y `await` en diferentes contextos.

#### **4.6.1. Lectura de Archivos Asíncrona Usando `aiofiles`**

```python
import asyncio
import aiofiles

async def leer_archivo(ruta_archivo):
    async with aiofiles.open(ruta_archivo, mode='r') as f:
        contenido = await f.read()
        print(contenido)

async def main():
    await leer_archivo('ejemplo.txt')

if __name__ == "__main__":
    asyncio.run(main())
```

**Descripción:**
Este ejemplo utiliza la biblioteca `aiofiles` para la lectura asíncrona de archivos. Esto permite que el programa continúe ejecutando otras tareas mientras se lee el archivo.

#### **4.6.2. Solicitudes HTTP Asíncronas Usando `aiohttp`**

```python
import asyncio
import aiohttp

async def obtener(url):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.text()

async def main():
    html = await obtener('https://www.example.com')
    print(html)

if __name__ == "__main__":
    asyncio.run(main())
```

**Descripción:**
Este ejemplo demuestra cómo realizar una solicitud HTTP asíncrona utilizando la biblioteca `aiohttp`. Las solicitudes asíncronas permiten enviar y recibir datos sin bloquear el hilo principal de ejecución.

#### **4.6.3. Procesamiento Asíncrono de Múltiples Tareas con `asyncio.gather`**

```python
import asyncio

async def descargar_archivo(id_archivo):
    print(f"Iniciando la descarga del archivo {id_archivo}")
    await asyncio.sleep(2)  # Simulando una descarga
    print(f"Descarga del archivo {id_archivo} completada")
    return f"Archivo {id_archivo}"

async def main():
    tareas = [descargar_archivo(i) for i in range(1, 4)]
    resultados = await asyncio.gather(*tareas)
    print("Todos los archivos descargados:")
    for resultado in resultados:
        print(resultado)

if __name__ == "__main__":
    asyncio.run(main())
```

**Salida:**
```
Iniciando la descarga del archivo 1
Iniciando la descarga del archivo 2
Iniciando la descarga del archivo 3
Descarga del archivo 1 completada
Descarga del archivo 2 completada
Descarga del archivo 3 completada
Todos los archivos descargados:
Archivo 1
Archivo 2
Archivo 3
```

**Descripción:**
En este ejemplo, tres tareas de descarga de archivos se ejecutan concurrentemente usando `asyncio.gather`, reduciendo significativamente el tiempo total de ejecución.

### **4.7. Gestión del Tiempo de Ejecución y Retrasos**

La programación asíncrona permite gestionar de manera eficiente el tiempo de ejecución de las tareas y el uso de retrasos sin bloquear el hilo principal.

#### **4.7.1. Usando `asyncio.sleep` para Crear Retrasos**

`asyncio.sleep` es la versión asíncrona de `time.sleep`, que suspende la ejecución de la corrutina durante un tiempo especificado sin bloquear el bucle de eventos.

```python
import asyncio

async def mensaje_con_retraso(mensaje, retraso):
    await asyncio.sleep(retraso)
    print(mensaje)

async def main():
    await asyncio.gather(
        mensaje_con_retraso("Mensaje después de 1 segundo", 1),
        mensaje_con_retraso("Mensaje después de 2 segundos", 2),
        mensaje_con_retraso("Mensaje después de 3 segundos", 3),
    )

if __name__ == "__main__":
    asyncio.run(main())
```

**Salida:**
```
Mensaje después de 1 segundo
Mensaje después de 2 segundos
Mensaje después de 3 segundos
```

#### **4.7.2. Limitando el Tiempo de Ejecución con `asyncio.wait_for`**

`asyncio.wait_for` permite establecer un límite de tiempo para la ejecución de una corrutina, después del cual será cancelada si no ha completado.

```python
import asyncio

async def tarea_larga():
    await asyncio.sleep(5)
    print("Tarea larga completada")

async def main():
    try:
        await asyncio.wait_for(tarea_larga(), timeout=3)
    except asyncio.TimeoutError:
        print("La tarea excedió el límite de tiempo y fue cancelada")

if __name__ == "__main__":
    asyncio.run(main())
```

**Salida:**
```
La tarea excedió el límite de tiempo y fue cancelada
```

**Descripción:**
En este ejemplo, `tarea_larga` simula una operación prolongada que no se completa dentro del límite de tiempo establecido, lo que resulta en su cancelación.

### **4.8. Manejo de Excepciones en Funciones Asíncronas**

El manejo de excepciones en funciones asíncronas es similar al código sincrónico, pero requiere atención sobre dónde y cómo se manejan las excepciones.

#### **4.8.1. Manejo de Excepciones Dentro de una Corrutina**

```python
import asyncio

async def tarea_defectuosa():
    await asyncio.sleep(1)
    raise ValueError("Ocurrió un error en la corrutina")

async def main():
    try:
        await tarea_defectuosa()
    except ValueError as e:
        print(f"Excepción capturada: {e}")

if __name__ == "__main__":
    asyncio.run(main())
```

**Salida:**
```
Excepción capturada: Ocurrió un error en la corrutina
```

#### **4.8.2. Manejo de Excepciones al Usar `asyncio.gather`**

Cuando se utiliza `asyncio.gather`, las excepciones en las corrutinas pueden agregarse. Por defecto, si alguna corrutina lanza una excepción, `asyncio.gather` la lanzará.

```python
import asyncio

async def tarea_exitosa():
    await asyncio.sleep(1)
    print("Tarea completada exitosamente")

async def tarea_fallida():
    await asyncio.sleep(2)
    raise RuntimeError("Error en la tarea")

async def main():
    try:
        await asyncio.gather(tarea_exitosa(), tarea_fallida())
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

**Descripción:**
En este ejemplo, `tarea_fallida` lanza un error, que es capturado en el bloque `try-except` dentro de la función `main`.

#### **4.8.3. Usando `asyncio.shield` para Proteger Corrutinas de Cancelación**

`asyncio.shield` permite proteger una corrutina de ser cancelada, asegurando que su ejecución continúe incluso si una tarea externa es cancelada.

```python
import asyncio

async def tarea_critica():
    print("Tarea crítica iniciada")
    await asyncio.sleep(3)
    print("Tarea crítica completada")

async def main():
    tarea = asyncio.create_task(asyncio.shield(tarea_critica()))
    await asyncio.sleep(1)
    tarea.cancel()
    try:
        await tarea
    except asyncio.CancelledError:
        print("La tarea fue cancelada, pero la tarea crítica continúa ejecutándose")

if __name__ == "__main__":
    asyncio.run(main())
```

**Salida:**
```
Tarea crítica iniciada
La tarea fue cancelada, pero la tarea crítica continúa ejecutándose
Tarea crítica completada
```

**Descripción:**
En este ejemplo, al usar `asyncio.shield`, se evita que la `tarea_critica` sea cancelada incluso cuando la tarea externa es cancelada.

### **4.9. Conclusión**

Las palabras clave `async` y `await` son elementos fundamentales de la programación asíncrona en Python. Permiten escribir código asíncrono que es fácil de leer y mantener mientras utiliza eficientemente los recursos del sistema. En este capítulo, exploramos cómo declarar funciones asíncronas, usar `await` para suspender la ejecución de corrutinas, ejecutar corrutinas y gestionar el tiempo de ejecución de las tareas. También examinamos ejemplos prácticos del uso de estas palabras clave en diversos contextos.

Comprender la sintaxis de `async` y `await` es un paso crucial para dominar la programación asíncrona. En los capítulos siguientes, profundizaremos en el funcionamiento del módulo `asyncio`, estudiaremos sus componentes centrales y aprenderemos a crear aplicaciones asíncronas más complejas.