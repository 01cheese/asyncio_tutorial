## **Capítulo 7: Bibliotecas y Frameworks Asíncronos**

### **7.1. Introducción a Bibliotecas y Frameworks Asíncronos**

La programación asíncrona en Python se hizo posible gracias al módulo `asyncio`, que proporciona las herramientas fundamentales para trabajar con corrutinas y el bucle de eventos. Sin embargo, para crear una aplicación asíncrona completa, a menudo se requieren bibliotecas y frameworks especializados. Estas herramientas amplían la funcionalidad de `asyncio` y simplifican el desarrollo. En este capítulo, exploraremos las bibliotecas y frameworks asíncronos más populares en el ecosistema de Python, sus características, ejemplos de uso y recomendaciones para elegir la herramienta adecuada para tareas específicas.

### **7.2. `aiohttp`: Solicitudes HTTP y Servidores Asíncronos**

#### **7.2.1. Introducción a `aiohttp`**

`aiohttp` es una biblioteca asíncrona para realizar solicitudes HTTP y crear servidores web basados en `asyncio`. Proporciona una interfaz conveniente para trabajar tanto con conexiones HTTP de cliente como de servidor, soporta WebSockets, enrutamiento de solicitudes y mucho más.

#### **7.2.2. Instalación de `aiohttp`**

Para instalar `aiohttp`, usa `pip`:

```bash
pip install aiohttp
```

#### **7.2.3. Solicitudes HTTP Asíncronas con `aiohttp`**

**Ejemplo de Realización de una Solicitud HTTP Asíncrona:**

```python
import aiohttp
import asyncio

async def fetch(session, url):
    async with session.get(url) as response:
        status = response.status
        data = await response.text()
        print(f"URL: {url}, Estado: {status}")
        return data

async def main():
    async with aiohttp.ClientSession() as session:
        urls = [
            'https://www.example.com',
            'https://www.python.org',
            'https://www.asyncio.org',
        ]
        tasks = [fetch(session, url) for url in urls]
        results = await asyncio.gather(*tasks)
        # Procesamiento adicional de resultados

if __name__ == "__main__":
    asyncio.run(main())
```

**Descripción:**

- Se crea una sesión de cliente usando `aiohttp.ClientSession`.
- La función `fetch` realiza una solicitud GET a la URL especificada y devuelve el contenido de la respuesta.
- Se crea una lista de tareas y se ejecutan concurrentemente usando `asyncio.gather`.

#### **7.2.4. Creación de un Servidor Web Asíncrono con `aiohttp`**

**Ejemplo de un Servidor Web Simple:**

```python
from aiohttp import web
import asyncio

async def handle(request):
    name = request.match_info.get('name', "Anonymous")
    text = f"¡Hola, {name}!"
    return web.Response(text=text)

async def init_app():
    app = web.Application()
    app.router.add_routes([web.get('/', handle),
                           web.get('/{name}', handle)])
    return app

def main():
    app = asyncio.run(init_app())
    web.run_app(app, host='127.0.0.1', port=8080)

if __name__ == '__main__':
    main()
```

**Descripción:**

- Se crea una aplicación web con enrutamiento de solicitudes.
- El manejador `handle` devuelve un mensaje de saludo.
- El servidor se ejecuta en `localhost` en el puerto `8080`.

#### **7.2.5. Características Adicionales de `aiohttp`**

- **WebSockets:** Soporte para conexiones bidireccionales en tiempo real.
- **Middlewares:** Permite agregar manejadores intermedios de solicitudes y respuestas.
- **Enrutamiento:** Sistema de enrutamiento flexible para gestionar URLs.
- **Servidor de Archivos Estáticos:** Soporte incorporado para servir archivos estáticos.

### **7.3. FastAPI: Framework Web Asíncrono Moderno**

#### **7.3.1. Introducción a FastAPI**

FastAPI es un framework web moderno y rápido (alto rendimiento) para construir APIs con Python 3.7+ basado en anotaciones de tipos estándar de Python. Está construido sobre las bibliotecas estándar `Starlette` para la parte web y `Pydantic` para la validación de datos. FastAPI es totalmente compatible con la programación asíncrona, lo que permite la creación de aplicaciones web de alto rendimiento.

#### **7.3.2. Instalación de FastAPI y Uvicorn**

Para instalar FastAPI, usa `pip`, y también instala el servidor ASGI `uvicorn` para ejecutar la aplicación:

```bash
pip install fastapi uvicorn
```

#### **7.3.3. Creación de una API Simple con FastAPI**

**Ejemplo de una API Simple:**

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def read_root():
    return {"message": "¡Hola, FastAPI!"}

@app.get("/items/{item_id}")
async def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}
```

**Ejecución del Servidor:**

```bash
uvicorn main:app --reload
```

**Descripción:**

- Las rutas se definen usando decoradores `@app.get`.
- Las funciones manejadoras devuelven diccionarios que se convierten automáticamente a JSON.
- Los parámetros de ruta y de consulta se extraen y validan automáticamente.

#### **7.3.4. Documentación Automática**

FastAPI genera automáticamente documentación interactiva para tu API utilizando Swagger UI y ReDoc. Accede a la documentación a través de las siguientes URLs:

- Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- ReDoc: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

#### **7.3.5. Validación de Datos con Pydantic**

FastAPI utiliza Pydantic para la validación y serialización de datos. Esto permite definir esquemas de datos usando modelos y validar automáticamente los datos entrantes.

**Ejemplo con un Modelo Pydantic:**

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    description: str = None
    price: float
    tax: float = None

@app.post("/items/")
async def create_item(item: Item):
    return {"name": item.name, "price": item.price}
```

**Descripción:**

- Se define un modelo Pydantic `Item` con campos requeridos y opcionales.
- En una solicitud POST, los datos se validan automáticamente y se convierten en una instancia de `Item`.

#### **7.3.6. Dependencias Asíncronas y Tareas en Segundo Plano**

FastAPI soporta dependencias asíncronas y tareas en segundo plano, permitiendo realizar acciones adicionales después de que la solicitud se haya completado.

**Ejemplo de una Tarea en Segundo Plano:**

```python
from fastapi import FastAPI, BackgroundTasks

app = FastAPI()

def write_log(message: str):
    with open("log.txt", "a") as log_file:
        log_file.write(message + "\n")

@app.post("/send-notification/")
async def send_notification(message: str, background_tasks: BackgroundTasks):
    background_tasks.add_task(write_log, message)
    return {"message": "Notificación enviada"}
```

**Descripción:**

- La función `write_log` se ejecuta en segundo plano, sin bloquear el hilo principal.
- La tarea en segundo plano se añade mediante `background_tasks.add_task`.

#### **7.3.7. Uso de FastAPI con Bases de Datos**

FastAPI se integra fácilmente con varias bases de datos, incluyendo SQL y NoSQL, gracias al soporte de drivers asíncronos y librerías ORM como `SQLAlchemy` y `Tortoise ORM`.

**Ejemplo de Integración con `SQLAlchemy` y `Databases`:**

```python
from fastapi import FastAPI
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String
from databases import Database

DATABASE_URL = "sqlite:///./test.db"

database = Database(DATABASE_URL)
metadata = MetaData()

notes = Table(
    "notes",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("text", String(length=100)),
    Column("completed", Integer),
)

engine = create_engine(DATABASE_URL)
metadata.create_all(engine)

app = FastAPI()

@app.on_event("startup")
async def startup():
    await database.connect()

@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

@app.post("/notes/")
async def create_note(text: str):
    query = notes.insert().values(text=text, completed=0)
    last_record_id = await database.execute(query)
    return {**{"id": last_record_id}, "text": text, "completed": 0}

@app.get("/notes/")
async def read_notes():
    query = notes.select()
    return await database.fetch_all(query)
```

**Descripción:**

- Se usa la biblioteca `databases` para la interacción asíncrona con la base de datos.
- La tabla `notes` se define usando `SQLAlchemy`.
- Los manejadores de solicitudes realizan operaciones asíncronas de inserción y selección.

#### **7.3.8. Ventajas de Usar FastAPI**

- **Alto Rendimiento:** Comparable a Go y NodeJS gracias al uso de `Starlette` y `Pydantic`.
- **Facilidad y Rapidez de Desarrollo:** Código mínimo requerido para crear una API completa.
- **Documentación Automática:** Genera documentación interactiva sin esfuerzo.
- **Seguridad de Tipos:** Soporte completo para anotaciones de tipos en Python, facilitando el desarrollo y depuración.
- **Asincronía:** Compatibilidad total con la programación asíncrona, permitiendo la creación de aplicaciones de alto rendimiento.

#### **7.3.9. Conclusión**

FastAPI es una herramienta poderosa para construir aplicaciones web modernas y APIs usando programación asíncrona. Su simplicidad, alto rendimiento y rico conjunto de características lo convierten en una excelente opción para desarrollar aplicaciones Python escalables y eficientes.

### **7.4. Tornado: Framework Web Asíncrono**

#### **7.4.1. Introducción a Tornado**

Tornado es un framework web asíncrono y una biblioteca de redes diseñada para proporcionar alto rendimiento y escalabilidad. Originalmente creado para manejar un gran número de conexiones simultáneas, lo que lo hace ideal para aplicaciones web en tiempo real como chats y servidores de juegos.

#### **7.4.2. Instalación de Tornado**

Para instalar Tornado, usa `pip`:

```bash
pip install tornado
```

#### **7.4.3. Creación de un Servidor Web Simple con Tornado**

**Ejemplo de un Servidor Web Simple:**

```python
import tornado.ioloop
import tornado.web

class MainHandler(tornado.web.RequestHandler):
    async def get(self):
        self.write("¡Hola, Tornado!")

def make_app():
    return tornado.web.Application([
        (r"/", MainHandler),
    ])

if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    print("El servidor está corriendo en http://localhost:8888")
    tornado.ioloop.IOLoop.current().start()
```

**Descripción:**

- Se define un manejador de solicitudes `MainHandler` para responder a solicitudes GET.
- Se crea una aplicación Tornado con enrutamiento.
- El servidor se ejecuta en el puerto `8888`.

#### **7.4.4. Manejadores de Solicitudes Asíncronos**

Tornado soporta manejadores de solicitudes asíncronos, permitiendo operaciones de larga duración sin bloquear el servidor.

**Ejemplo de un Manejador Asíncrono:**

```python
import tornado.ioloop
import tornado.web
import asyncio

class AsyncHandler(tornado.web.RequestHandler):
    async def get(self):
        await asyncio.sleep(2)  # Simula una operación larga
        self.write("Respuesta asíncrona después de la demora")

def make_app():
    return tornado.web.Application([
        (r"/", AsyncHandler),
    ])

if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    print("Servidor asíncrono corriendo en http://localhost:8888")
    tornado.ioloop.IOLoop.current().start()
```

**Descripción:**

- El manejador `AsyncHandler` realiza una demora asíncrona antes de responder.
- El servidor puede manejar otras solicitudes mientras espera a que se complete la demora.

#### **7.4.5. Soporte para WebSockets**

Tornado tiene soporte incorporado para WebSockets, permitiendo la creación de aplicaciones en tiempo real.

**Ejemplo de un Servidor WebSocket:**

```python
import tornado.ioloop
import tornado.web
import tornado.websocket

class EchoWebSocket(tornado.websocket.WebSocketHandler):
    def open(self):
        print("Nueva conexión WebSocket")

    def on_message(self, message):
        print(f"Mensaje recibido: {message}")
        self.write_message(f"Eco: {message}")

    def on_close(self):
        print("Conexión WebSocket cerrada")

def make_app():
    return tornado.web.Application([
        (r"/ws", EchoWebSocket),
    ])

if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    print("Servidor WebSocket corriendo en ws://localhost:8888/ws")
    tornado.ioloop.IOLoop.current().start()
```

**Descripción:**

- Se define un manejador WebSocket `EchoWebSocket` para eco de mensajes recibidos.
- El servidor escucha conexiones WebSocket en la ruta `/ws`.

#### **7.4.6. Ventajas de Tornado**

- **Alto Rendimiento:** Optimizado para manejar un gran número de conexiones concurrentes.
- **Soporte en Tiempo Real:** Soporte incorporado para WebSockets y otros protocolos en tiempo real.
- **Flexibilidad:** Permite crear aplicaciones web simples y complejas.
- **Fiabilidad:** Probado en productos a gran escala como FriendFeed y Facebook.

#### **7.4.7. Limitaciones de Tornado**

- **Sintaxis Menos Moderna:** En comparación con FastAPI, Tornado puede parecer menos intuitivo para desarrollar APIs modernas.
- **Menos Características Incorporadas:** Algunos frameworks modernos ofrecen más funcionalidades incorporadas, como documentación automática o validación de datos.

#### **7.4.8. Conclusión**

Tornado es un framework poderoso y flexible para construir aplicaciones web asíncronas y servidores en tiempo real. Su alto rendimiento y soporte para WebSockets lo convierten en una excelente opción para aplicaciones que requieren manejar numerosas conexiones simultáneas. Sin embargo, para desarrollar APIs modernas con documentación automática y validación de datos, FastAPI podría ser una opción más preferible.

### **7.5. Sanic: Framework Web Asíncrono de Alto Rendimiento**

#### **7.5.1. Introducción a Sanic**

Sanic es un framework web asíncrono diseñado para alto rendimiento y velocidad en el manejo de solicitudes. Inspirado en el framework Flask, ofrece soporte completo para programación asíncrona, permitiendo la creación de aplicaciones web rápidas y escalables.

#### **7.5.2. Instalación de Sanic**

Para instalar Sanic, usa `pip`:

```bash
pip install sanic
```

#### **7.5.3. Creación de un Servidor Web Simple con Sanic**

**Ejemplo de un Servidor Web Simple:**

```python
from sanic import Sanic
from sanic.response import json

app = Sanic("MySanicApp")

@app.route("/")
async def handle_request(request):
    return json({"message": "¡Hola, Sanic!"})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=True)
```

**Descripción:**

- Se crea una instancia de la aplicación Sanic.
- Se define una ruta `/` con un manejador asíncrono `handle_request`.
- El servidor se ejecuta en `localhost` en el puerto `8000`.

#### **7.5.4. Manejadores de Solicitudes Asíncronos**

Sanic soporta completamente manejadores de solicitudes asíncronos, permitiendo operaciones de larga duración sin bloquear el servidor.

**Ejemplo de un Manejador Asíncrono:**

```python
from sanic import Sanic
from sanic.response import text
import asyncio

app = Sanic("AsyncHandlerApp")

@app.route("/delay")
async def handle_delay(request):
    await asyncio.sleep(3)  # Simula una operación larga
    return text("Retraso completado")

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000)
```

**Descripción:**

- El manejador `handle_delay` realiza una demora asíncrona antes de responder.
- El servidor puede manejar otras solicitudes mientras espera a que se complete la demora.

#### **7.5.5. Soporte para WebSockets**

Sanic proporciona soporte incorporado para WebSockets, permitiendo la creación de aplicaciones en tiempo real.

**Ejemplo de un Servidor WebSocket:**

```python
from sanic import Sanic
from sanic.websocket import WebSocketProtocol

app = Sanic("WebSocketApp")

@app.websocket("/ws")
async def feed(request, ws):
    while True:
        data = await ws.recv()
        print(f"Mensaje recibido: {data}")
        await ws.send(f"Eco: {data}")

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, protocol=WebSocketProtocol)
```

**Descripción:**

- Se define un manejador WebSocket `feed` para eco de mensajes recibidos.
- El servidor escucha conexiones WebSocket en la ruta `/ws`.

#### **7.5.6. Uso de Middleware en Sanic**

El middleware permite realizar operaciones antes y después del manejo de solicitudes. Esto es útil para agregar funcionalidades comunes como registro o autenticación.

**Ejemplo de Middleware para Registrar Solicitudes:**

```python
from sanic import Sanic
from sanic.response import json

app = Sanic("MiddlewareApp")

@app.middleware('request')
async def log_request(request):
    print(f"Solicitud recibida: {request.method} {request.path}")

@app.route("/")
async def handle_request(request):
    return json({"message": "¡Hola, Sanic con Middleware!"})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000)
```

**Descripción:**

- El middleware `log_request` registra cada solicitud entrante antes de ser procesada.
- Permite agregar acciones adicionales antes o después del manejo de solicitudes.

#### **7.5.7. Ventajas de Sanic**

- **Alto Rendimiento:** Optimizado para un manejo rápido de solicitudes.
- **Facilidad de Uso:** Sintaxis similar a Flask que facilita la adopción para desarrolladores familiarizados con Flask.
- **Asincronía Completa:** Permite la creación de aplicaciones escalables y eficientes.
- **Soporte para WebSockets:** Soporte incorporado para conexiones bidireccionales en tiempo real.

#### **7.5.8. Limitaciones de Sanic**

- **Menos Características Incorporadas:** En comparación con FastAPI, Sanic puede requerir bibliotecas adicionales para la validación de datos y documentación automática.
- **Comunidad Menos Activa:** Aunque Sanic es un framework popular, su comunidad y recursos pueden ser más pequeños en comparación con FastAPI.

#### **7.5.9. Conclusión**

Sanic es una excelente opción para desarrolladores que buscan construir aplicaciones web asíncronas de alto rendimiento con un código mínimo. Su simplicidad y velocidad lo hacen una opción atractiva para proyectos que requieren un manejo rápido de solicitudes y soporte en tiempo real.

### **7.6. Tornado vs. FastAPI vs. Sanic: Comparación de Frameworks Asíncronos**

#### **7.6.1. Tabla Comparativa**

| **Característica**          | **Tornado**                                       | **FastAPI**                                      | **Sanic**                                       |
|-----------------------------|---------------------------------------------------|--------------------------------------------------|-------------------------------------------------|
| **Enfoque Principal**       | Servidores web de alto rendimiento y aplicaciones de redes | Construcción de APIs modernas con documentación automática | Aplicaciones web asíncronas de alto rendimiento |
| **Rendimiento**             | Alto                                              | Muy Alto                                         | Muy Alto                                        |
| **Sintaxis**                | Más tradicional, menos intuitiva                  | Moderna, basada en anotaciones de tipos          | Similar a Flask, simple y comprensible          |
| **Soporte para WebSockets** | Incorporado                                       | Requiere bibliotecas adicionales                  | Incorporado                                     |
| **Documentación Automática**| No                                                | Sí (Swagger UI, ReDoc)                           | No                                              |
| **Validación de Datos**     | Requiere bibliotecas adicionales                  | Incorporado con Pydantic                          | Requiere bibliotecas adicionales                |
| **Comunidad y Soporte**     | Madura y estable                                  | En rápido crecimiento, activa                      | Activa pero más pequeña comparada con FastAPI   |
| **Facilidad de Aprendizaje**| Media                                             | Alta debido a sintaxis simple                      | Alta debido a similitud con Flask                |

#### **7.6.2. Cuándo Usar Cada Framework**

- **Tornado:**
  - **Caso de Uso:** Construcción de aplicaciones web en tiempo real, chats, servidores de juegos.
  - **Ventajas:** Soporte incorporado para WebSockets, alto rendimiento.
  - **Desventajas:** Sintaxis menos intuitiva, requiere bibliotecas adicionales para características modernas.

- **FastAPI:**
  - **Caso de Uso:** Construcción de APIs RESTful modernas, microservicios, aplicaciones con documentación automática.
  - **Ventajas:** Documentación automática, validación de datos incorporada con Pydantic, alto rendimiento.
  - **Desventajas:** Menos soporte incorporado para WebSockets (requiere bibliotecas adicionales).

- **Sanic:**
  - **Caso de Uso:** Aplicaciones web de alto rendimiento que requieren soporte en tiempo real.
  - **Ventajas:** Facilidad de uso, alto rendimiento, soporte incorporado para WebSockets.
  - **Desventajas:** Requiere bibliotecas adicionales para validación de datos y documentación automática.

#### **7.6.3. Elegir el Framework Adecuado**

La elección del framework depende de los requisitos específicos de tu proyecto:

- **Si necesitas documentación automática y validación de datos simple:** **FastAPI** es una excelente elección.
- **Si estás construyendo una aplicación en tiempo real con soporte para WebSockets:** Considera **Tornado** o **Sanic**.
- **Si el alto rendimiento y la facilidad de uso con un esfuerzo mínimo son importantes:** **Sanic** podría ser la opción preferida.

### **7.7. Otras Bibliotecas y Frameworks Asíncronos**

Además de `aiohttp`, FastAPI, Tornado y Sanic, existen numerosas otras bibliotecas y frameworks asíncronos que pueden ser útiles en diversos escenarios.

#### **7.7.1. Starlette**

**Starlette** es un framework web asíncrono ligero sobre el cual se construyen FastAPI y otros frameworks populares. Proporciona las herramientas básicas para crear aplicaciones web, como enrutamiento, middleware, soporte para WebSockets y más.

**Ejemplo de Uso de Starlette:**

```python
from starlette.applications import Starlette
from starlette.responses import JSONResponse
from starlette.routing import Route
import uvicorn

async def homepage(request):
    return JSONResponse({"message": "¡Hola, Starlette!"})

app = Starlette(debug=True, routes=[
    Route("/", homepage),
])

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
```

#### **7.7.2. Quart**

**Quart** es un framework web asíncrono compatible con la API de Flask, construido sobre `asyncio`. Soporta todas las características principales de Flask pero añade manejo de solicitudes asíncronas.

**Ejemplo de Uso de Quart:**

```python
from quart import Quart, jsonify

app = Quart(__name__)

@app.route("/")
async def hello():
    return jsonify(message="¡Hola, Quart!")

if __name__ == "__main__":
    app.run()
```

#### **7.7.3. Django Channels**

**Django Channels** extiende las capacidades de Django añadiendo soporte para programación asíncrona y WebSockets. Permite construir aplicaciones en tiempo real sobre Django.

**Ejemplo de Uso de Channels:**

```python
# routing.py
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path
from myapp import consumers

application = ProtocolTypeRouter({
    "websocket": AuthMiddlewareStack(
        URLRouter([
            path("ws/chat/", consumers.ChatConsumer.as_asgi()),
        ])
    ),
})

# consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
import json

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
    
    async def disconnect(self, close_code):
        pass
    
    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        await self.send(text_data=json.dumps({
            "message": message
        }))
```

### **7.8. Trio y Curio: Bibliotecas Asíncronas Alternativas**

**Trio** y **Curio** son bibliotecas alternativas para programación asíncrona en Python, ofreciendo interfaces más modernas y amigables en comparación con `asyncio`.

#### **7.8.1. Trio**

**Trio** es una biblioteca de programación asíncrona enfocada en la simplicidad, seguridad y legibilidad del código. Ofrece un enfoque moderno a la asincronía basado en el concepto de "nurseries" para manejar corrutinas.

**Ejemplo de Uso de Trio:**

```python
import trio

async def say_hello(name):
    print(f"Hola, {name}!")
    await trio.sleep(1)
    print(f"Adiós, {name}!")

async def main():
    async with trio.open_nursery() as nursery:
        nursery.start_soon(say_hello, "Alice")
        nursery.start_soon(say_hello, "Bob")

if __name__ == "__main__":
    trio.run(main)
```

#### **7.8.2. Curio**

**Curio** es una biblioteca de programación asíncrona minimalista diseñada para trabajar exclusivamente con `async` y `await`. Se enfoca en la simplicidad y eficiencia, omitiendo algunas de las características más complejas de `asyncio`.

**Ejemplo de Uso de Curio:**

```python
import curio

async def greet(name):
    print(f"Hola, {name}!")
    await curio.sleep(1)
    print(f"Adiós, {name}!")

async def main():
    await curio.spawn(greet, "Alice")
    await curio.spawn(greet, "Bob")
    await curio.sleep(2.5)

if __name__ == "__main__":
    curio.run(main)
```

#### **7.8.3. Comparación de Trio, Curio y asyncio**

| **Característica**          | **asyncio**                                      | **Trio**                                         | **Curio**                                        |
|-----------------------------|--------------------------------------------------|--------------------------------------------------|--------------------------------------------------|
| **Filosofía**               | Compatibilidad con código existente, flexibilidad| Simplicidad y seguridad, "nurseries"             | Minimalismo y eficiencia                         |
| **Manejo de Corrutinas**    | Usa bucles de eventos y tareas                   | Usa "nurseries" para manejar corrutinas           | Usa funciones simples y tareas                   |
| **Compatibilidad**          | Amplia compatibilidad con otras bibliotecas      | Menos compatibilidad, pero comunidad en crecimiento| Compatibilidad muy limitada                     |
| **Facilidad de Uso**        | Interfaz más compleja                            | Interfaz más simple e intuitiva                   | Interfaz minimalista y directa                   |
| **Soporte del Ecosistema**  | Ecosistema rico y numerosas bibliotecas          | Ecosistema en crecimiento                        | Ecosistema limitado                              |
| **Rendimiento**             | Alto, pero puede estar menos optimizado           | Muy alto y optimizado                             | Alto y minimalista                               |

#### **7.8.4. Elegir Entre Trio, Curio y asyncio**

- **Usar `asyncio`:**
  - Si necesitas amplia compatibilidad con bibliotecas y frameworks existentes.
  - Si estás trabajando en proyectos que ya usan `asyncio`.

- **Usar `Trio`:**
  - Si estás iniciando un nuevo proyecto y quieres aprovechar conceptos modernos de programación asíncrona.
  - Si la simplicidad y seguridad en el manejo de corrutinas son importantes para ti.

- **Usar `Curio`:**
  - Si necesitas un enfoque minimalista y altamente eficiente para programación asíncrona.
  - Si estás dispuesto a trabajar con un ecosistema limitado y no requieres compatibilidad con `asyncio`.

### **7.9. Conclusión**

Las bibliotecas y frameworks asíncronos juegan un papel crucial en el desarrollo de aplicaciones Python de alto rendimiento y escalables. En este capítulo, exploramos herramientas clave como `aiohttp`, FastAPI, Tornado, Sanic y bibliotecas alternativas como Trio y Curio. Cada una de estas herramientas tiene sus propias fortalezas y limitaciones, y la elección de la adecuada depende de los requisitos específicos de tu proyecto.