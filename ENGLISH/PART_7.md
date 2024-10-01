## **Chapter 7: Asynchronous Libraries and Frameworks**

### **7.1. Introduction to Asynchronous Libraries and Frameworks**

Asynchronous programming in Python became possible thanks to the `asyncio` module, which provides the fundamental tools for working with coroutines and the event loop. However, to create a fully-fledged asynchronous application, specialized libraries and frameworks are often required. These tools extend the functionality of `asyncio` and simplify development. In this chapter, we will explore the most popular asynchronous libraries and frameworks in the Python ecosystem, their features, usage examples, and recommendations for choosing the right tool for specific tasks.

### **7.2. `aiohttp`: Asynchronous HTTP Requests and Servers**

#### **7.2.1. Introduction to `aiohttp`**

`aiohttp` is an asynchronous library for performing HTTP requests and creating web servers based on `asyncio`. It provides a convenient interface for working with both client and server HTTP connections, supports WebSockets, request routing, and much more.

#### **7.2.2. Installing `aiohttp`**

To install `aiohttp`, use `pip`:

```bash
pip install aiohttp
```

#### **7.2.3. Asynchronous HTTP Requests with `aiohttp`**

**Example of Performing an Asynchronous HTTP Request:**

```python
import aiohttp
import asyncio

async def fetch(session, url):
    async with session.get(url) as response:
        status = response.status
        data = await response.text()
        print(f"URL: {url}, Status: {status}")
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
        # Additional processing of results

if __name__ == "__main__":
    asyncio.run(main())
```

**Description:**

- A client session is created using `aiohttp.ClientSession`.
- The `fetch` function performs a GET request to the specified URL and returns the response content.
- A list of tasks is created and executed concurrently using `asyncio.gather`.

#### **7.2.4. Creating an Asynchronous Web Server with `aiohttp`**

**Example of a Simple Web Server:**

```python
from aiohttp import web
import asyncio

async def handle(request):
    name = request.match_info.get('name', "Anonymous")
    text = f"Hello, {name}!"
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

**Description:**

- A web application is created with request routing.
- The `handle` handler returns a greeting message.
- The server runs on `localhost` at port `8080`.

#### **7.2.5. Additional Features of `aiohttp`**

- **WebSockets:** Support for bidirectional real-time connections.
- **Middlewares:** Allows adding intermediate request and response handlers.
- **Routing:** Flexible routing system for managing URLs.
- **Static File Server:** Built-in support for serving static files.

### **7.3. FastAPI: Modern Asynchronous Web Framework**

#### **7.3.1. Introduction to FastAPI**

FastAPI is a modern, fast (high-performance) web framework for building APIs with Python 3.7+ based on standard Python type hints. It is built on top of the standard libraries `Starlette` for the web part and `Pydantic` for data validation. FastAPI is fully compatible with asynchronous programming, enabling the creation of high-performance web applications.

#### **7.3.2. Installing FastAPI and Uvicorn**

To install FastAPI, use `pip`, and also install the ASGI server `uvicorn` to run the application:

```bash
pip install fastapi uvicorn
```

#### **7.3.3. Creating a Simple API with FastAPI**

**Example of a Simple API:**

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def read_root():
    return {"message": "Hello, FastAPI!"}

@app.get("/items/{item_id}")
async def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}
```

**Running the Server:**

```bash
uvicorn main:app --reload
```

**Description:**

- Routes are defined using `@app.get` decorators.
- Handler functions return dictionaries that are automatically converted to JSON.
- Route and query parameters are automatically extracted and validated.

#### **7.3.4. Automatic Documentation**

FastAPI automatically generates interactive documentation for your API using Swagger UI and ReDoc. Access the documentation via the following URLs:

- Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- ReDoc: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

#### **7.3.5. Data Validation with Pydantic**

FastAPI uses Pydantic for data validation and serialization. This allows defining data schemas using models and automatically validating incoming data.

**Example with a Pydantic Model:**

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

**Description:**

- A Pydantic model `Item` is defined with required and optional fields.
- On a POST request, the data is automatically validated and converted into an `Item` instance.

#### **7.3.6. Asynchronous Dependencies and Background Tasks**

FastAPI supports asynchronous dependencies and background tasks, allowing additional actions to be performed after the request is completed.

**Example of a Background Task:**

```python
from fastapi import FastAPI, BackgroundTasks

app = FastAPI()

def write_log(message: str):
    with open("log.txt", "a") as log_file:
        log_file.write(message + "\n")

@app.post("/send-notification/")
async def send_notification(message: str, background_tasks: BackgroundTasks):
    background_tasks.add_task(write_log, message)
    return {"message": "Notification sent"}
```

**Description:**

- The `write_log` function runs in the background, not blocking the main thread.
- The background task is added via `background_tasks.add_task`.

#### **7.3.7. Using FastAPI with Databases**

FastAPI easily integrates with various databases, including SQL and NoSQL, thanks to support for asynchronous drivers and ORM libraries like `SQLAlchemy` and `Tortoise ORM`.

**Example Integration with `SQLAlchemy` and `Databases`:**

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

**Description:**

- The `databases` library is used for asynchronous interaction with the database.
- The `notes` table is defined using `SQLAlchemy`.
- Request handlers perform asynchronous insert and select operations.

#### **7.3.8. Advantages of Using FastAPI**

- **High Performance:** Comparable to Go and NodeJS due to the use of `Starlette` and `Pydantic`.
- **Ease and Speed of Development:** Minimal code required to create a full-featured API.
- **Automatic Documentation:** Generates interactive documentation effortlessly.
- **Type Safety:** Full support for Python type annotations, facilitating development and debugging.
- **Asynchronicity:** Full compatibility with asynchronous programming, enabling the creation of high-performance applications.

#### **7.3.9. Conclusion**

FastAPI is a powerful tool for building modern web applications and APIs using asynchronous programming. Its simplicity, high performance, and rich feature set make it an excellent choice for developing scalable and efficient Python applications.

### **7.4. Tornado: Asynchronous Web Framework**

#### **7.4.1. Introduction to Tornado**

Tornado is an asynchronous web framework and networking library designed to provide high performance and scalability. It was originally created to handle a large number of simultaneous connections, making it ideal for real-time web applications such as chats and gaming servers.

#### **7.4.2. Installing Tornado**

To install Tornado, use `pip`:

```bash
pip install tornado
```

#### **7.4.3. Creating a Simple Web Server with Tornado**

**Example of a Simple Web Server:**

```python
import tornado.ioloop
import tornado.web

class MainHandler(tornado.web.RequestHandler):
    async def get(self):
        self.write("Hello, Tornado!")

def make_app():
    return tornado.web.Application([
        (r"/", MainHandler),
    ])

if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    print("Server is running at http://localhost:8888")
    tornado.ioloop.IOLoop.current().start()
```

**Description:**

- A request handler `MainHandler` is defined to respond to GET requests.
- A Tornado application is created with routing.
- The server runs on port `8888`.

#### **7.4.4. Asynchronous Request Handlers**

Tornado supports asynchronous request handlers, allowing long-running operations without blocking the server.

**Example of an Asynchronous Handler:**

```python
import tornado.ioloop
import tornado.web
import asyncio

class AsyncHandler(tornado.web.RequestHandler):
    async def get(self):
        await asyncio.sleep(2)  # Simulate a long operation
        self.write("Asynchronous response after delay")

def make_app():
    return tornado.web.Application([
        (r"/", AsyncHandler),
    ])

if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    print("Asynchronous server running at http://localhost:8888")
    tornado.ioloop.IOLoop.current().start()
```

**Description:**

- The `AsyncHandler` performs an asynchronous delay before responding.
- The server can handle other requests while waiting for the delay to complete.

#### **7.4.5. Support for WebSockets**

Tornado has built-in support for WebSockets, enabling the creation of real-time applications.

**Example of a WebSocket Server:**

```python
import tornado.ioloop
import tornado.web
import tornado.websocket

class EchoWebSocket(tornado.websocket.WebSocketHandler):
    def open(self):
        print("New WebSocket connection")

    def on_message(self, message):
        print(f"Received message: {message}")
        self.write_message(f"Echo: {message}")

    def on_close(self):
        print("WebSocket connection closed")

def make_app():
    return tornado.web.Application([
        (r"/ws", EchoWebSocket),
    ])

if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    print("WebSocket server running at ws://localhost:8888/ws")
    tornado.ioloop.IOLoop.current().start()
```

**Description:**

- A `EchoWebSocket` handler is defined to echo received messages.
- The server listens for WebSocket connections on the `/ws` route.

#### **7.4.6. Advantages of Tornado**

- **High Performance:** Optimized for handling a large number of concurrent connections.
- **Real-Time Support:** Built-in support for WebSockets and other real-time protocols.
- **Flexibility:** Allows creating both simple and complex web applications.
- **Reliability:** Proven in large-scale products like FriendFeed and Facebook.

#### **7.4.7. Limitations of Tornado**

- **Less Modern Syntax:** Compared to FastAPI, Tornado may appear less intuitive for developing modern APIs.
- **Fewer Built-in Features:** Some modern frameworks offer more built-in functionalities, such as automatic documentation or data validation.

#### **7.4.8. Conclusion**

Tornado is a powerful and flexible framework for building asynchronous web applications and real-time servers. Its high performance and WebSocket support make it an excellent choice for applications requiring the handling of numerous simultaneous connections. However, for developing modern APIs with automatic documentation and data validation, FastAPI might be a more preferable option.

### **7.5. Sanic: High-Performance Asynchronous Web Framework**

#### **7.5.1. Introduction to Sanic**

Sanic is an asynchronous web framework designed for high performance and speed in handling requests. Inspired by the Flask framework, it offers full support for asynchronous programming, enabling the creation of fast and scalable web applications.

#### **7.5.2. Installing Sanic**

To install Sanic, use `pip`:

```bash
pip install sanic
```

#### **7.5.3. Creating a Simple Web Server with Sanic**

**Example of a Simple Web Server:**

```python
from sanic import Sanic
from sanic.response import json

app = Sanic("MySanicApp")

@app.route("/")
async def handle_request(request):
    return json({"message": "Hello, Sanic!"})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=True)
```

**Description:**

- An instance of the Sanic application is created.
- A route `/` is defined with an asynchronous handler `handle_request`.
- The server runs on `localhost` at port `8000`.

#### **7.5.4. Asynchronous Request Handlers**

Sanic fully supports asynchronous request handlers, allowing long-running operations without blocking the server.

**Example of an Asynchronous Handler:**

```python
from sanic import Sanic
from sanic.response import text
import asyncio

app = Sanic("AsyncHandlerApp")

@app.route("/delay")
async def handle_delay(request):
    await asyncio.sleep(3)  # Simulate a long operation
    return text("Delay completed")

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000)
```

**Description:**

- The `handle_delay` handler performs an asynchronous delay before responding.
- The server can handle other requests while waiting for the delay to complete.

#### **7.5.5. Support for WebSockets**

Sanic provides built-in support for WebSockets, enabling the creation of real-time applications.

**Example of a WebSocket Server:**

```python
from sanic import Sanic
from sanic.websocket import WebSocketProtocol

app = Sanic("WebSocketApp")

@app.websocket("/ws")
async def feed(request, ws):
    while True:
        data = await ws.recv()
        print(f"Received message: {data}")
        await ws.send(f"Echo: {data}")

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, protocol=WebSocketProtocol)
```

**Description:**

- A WebSocket handler `feed` is defined to echo received messages.
- The server listens for WebSocket connections on the `/ws` route.

#### **7.5.6. Using Middleware in Sanic**

Middleware allows performing operations before and after request handling. This is useful for adding common functionalities like logging or authentication.

**Example of Middleware for Logging Requests:**

```python
from sanic import Sanic
from sanic.response import json

app = Sanic("MiddlewareApp")

@app.middleware('request')
async def log_request(request):
    print(f"Received request: {request.method} {request.path}")

@app.route("/")
async def handle_request(request):
    return json({"message": "Hello, Sanic with Middleware!"})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000)
```

**Description:**

- Middleware `log_request` logs every incoming request before it's processed.
- Allows adding additional actions before or after request handling.

#### **7.5.7. Advantages of Sanic**

- **High Performance:** Optimized for fast request handling.
- **Ease of Use:** Flask-like syntax makes it easy for developers familiar with Flask to adopt.
- **Full Asynchronicity:** Enables the creation of scalable and efficient applications.
- **WebSocket Support:** Built-in support for real-time bidirectional connections.

#### **7.5.8. Limitations of Sanic**

- **Fewer Built-in Features:** Compared to FastAPI, Sanic may require additional libraries for data validation and automatic documentation.
- **Less Active Community:** While Sanic is a popular framework, its community and resources may be smaller compared to FastAPI.

#### **7.5.9. Conclusion**

Sanic is an excellent choice for developers aiming to build high-performance asynchronous web applications with minimal code. Its simplicity and speed make it an attractive option for projects requiring rapid request handling and real-time support.

### **7.6. Tornado vs. FastAPI vs. Sanic: Comparison of Asynchronous Frameworks**

#### **7.6.1. Comparative Table**

| **Feature**                | **Tornado**                                      | **FastAPI**                                      | **Sanic**                                       |
|----------------------------|--------------------------------------------------|--------------------------------------------------|-------------------------------------------------|
| **Primary Focus**          | High-performance web servers and networking applications | Building modern APIs with automatic documentation | High-performance asynchronous web applications |
| **Performance**            | High                                             | Very High                                        | Very High                                       |
| **Syntax**                 | More traditional, less intuitive                 | Modern, based on type annotations                | Flask-like, simple and understandable           |
| **WebSocket Support**      | Built-in                                         | Requires additional libraries                    | Built-in                                        |
| **Automatic Documentation**| No                                               | Yes (Swagger UI, ReDoc)                           | No                                              |
| **Data Validation**        | Requires additional libraries                    | Built-in with Pydantic                           | Requires additional libraries                   |
| **Community and Support**  | Mature and stable                                 | Fast-growing, active                              | Active but smaller compared to FastAPI           |
| **Ease of Learning**       | Medium                                           | High due to simple syntax                        | High due to similarity with Flask                |

#### **7.6.2. When to Use Each Framework**

- **Tornado:**
  - **Use Case:** Building real-time web applications, chats, gaming servers.
  - **Advantages:** Built-in WebSocket support, high performance.
  - **Disadvantages:** Less intuitive syntax, requires additional libraries for modern features.

- **FastAPI:**
  - **Use Case:** Building modern RESTful APIs, microservices, applications with automatic documentation.
  - **Advantages:** Automatic documentation, built-in data validation with Pydantic, high performance.
  - **Disadvantages:** Less built-in WebSocket support (requires additional libraries).

- **Sanic:**
  - **Use Case:** High-performance web applications requiring real-time support.
  - **Advantages:** Ease of use, high performance, built-in WebSocket support.
  - **Disadvantages:** Requires additional libraries for data validation and automatic documentation.

#### **7.6.3. Choosing the Right Framework**

The choice of framework depends on the specific requirements of your project:

- **If you need automatic documentation and simple data validation:** **FastAPI** is an excellent choice.
- **If you are building a real-time application with WebSocket support:** Consider **Tornado** or **Sanic**.
- **If high performance and ease of use with minimal effort are important:** **Sanic** might be the preferred option.

### **7.7. Other Asynchronous Libraries and Frameworks**

In addition to `aiohttp`, FastAPI, Tornado, and Sanic, there are numerous other asynchronous libraries and frameworks that can be useful in various scenarios.

#### **7.7.1. Starlette**

**Starlette** is a lightweight asynchronous web framework upon which FastAPI and other popular frameworks are built. It provides the basic tools for creating web applications, such as routing, middleware, WebSocket support, and more.

**Example of Using Starlette:**

```python
from starlette.applications import Starlette
from starlette.responses import JSONResponse
from starlette.routing import Route
import uvicorn

async def homepage(request):
    return JSONResponse({"message": "Hello, Starlette!"})

app = Starlette(debug=True, routes=[
    Route("/", homepage),
])

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
```

#### **7.7.2. Quart**

**Quart** is an asynchronous web framework compatible with the Flask API, built on top of `asyncio`. It supports all major Flask features but adds asynchronous request handling.

**Example of Using Quart:**

```python
from quart import Quart, jsonify

app = Quart(__name__)

@app.route("/")
async def hello():
    return jsonify(message="Hello, Quart!")

if __name__ == "__main__":
    app.run()
```

#### **7.7.3. Django Channels**

**Django Channels** extends Django’s capabilities by adding support for asynchronous programming and WebSockets. It allows building real-time applications on top of Django.

**Example of Using Channels:**

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

### **7.8. Trio and Curio: Alternative Asynchronous Libraries**

**Trio** and **Curio** are alternative libraries for asynchronous programming in Python, offering more modern and user-friendly interfaces compared to `asyncio`.

#### **7.8.1. Trio**

**Trio** is an asynchronous programming library focused on simplicity, safety, and code readability. It offers a modern approach to asynchrony based on the concept of "nurseries" for managing coroutines.

**Example of Using Trio:**

```python
import trio

async def say_hello(name):
    print(f"Hello, {name}!")
    await trio.sleep(1)
    print(f"Goodbye, {name}!")

async def main():
    async with trio.open_nursery() as nursery:
        nursery.start_soon(say_hello, "Alice")
        nursery.start_soon(say_hello, "Bob")

if __name__ == "__main__":
    trio.run(main)
```

#### **7.8.2. Curio**

**Curio** is a minimalist asynchronous programming library designed to work exclusively with `async` and `await`. It focuses on simplicity and efficiency, omitting some of the more complex features of `asyncio`.

**Example of Using Curio:**

```python
import curio

async def greet(name):
    print(f"Hello, {name}!")
    await curio.sleep(1)
    print(f"Goodbye, {name}!")

async def main():
    await curio.spawn(greet, "Alice")
    await curio.spawn(greet, "Bob")
    await curio.sleep(2.5)

if __name__ == "__main__":
    curio.run(main)
```

#### **7.8.3. Comparison of Trio, Curio, and asyncio**

| **Feature**                | **asyncio**                                      | **Trio**                                         | **Curio**                                        |
|----------------------------|--------------------------------------------------|--------------------------------------------------|--------------------------------------------------|
| **Philosophy**             | Compatibility with existing code, flexibility     | Simplicity and safety, "nurseries"                | Minimalism and efficiency                        |
| **Coroutine Management**   | Uses event loops and tasks                        | Uses "nurseries" for managing coroutines          | Uses simple functions and tasks                  |
| **Compatibility**          | Wide compatibility with other libraries           | Less compatibility, but growing community         | Very limited compatibility                       |
| **Ease of Use**            | More complex interface                            | Simpler and more intuitive interface              | Minimalist and straightforward interface         |
| **Ecosystem Support**      | Rich ecosystem and numerous libraries             | Growing ecosystem                                 | Limited ecosystem                                |
| **Performance**            | High, but may be less optimized                    | Very high and optimized                           | High and minimalist                              |

#### **7.8.4. Choosing Between Trio, Curio, and asyncio**

- **Use `asyncio`:**
  - If you need broad compatibility with existing libraries and frameworks.
  - If you are working on projects that already use `asyncio`.

- **Use `Trio`:**
  - If you are starting a new project and want to leverage modern asynchronous programming concepts.
  - If simplicity and safety in coroutine management are important to you.

- **Use `Curio`:**
  - If you need a minimalist and highly efficient approach to asynchronous programming.
  - If you are willing to work with a limited ecosystem and do not require compatibility with `asyncio`.

### **7.9. Conclusion**

Asynchronous libraries and frameworks play a crucial role in developing high-performance and scalable Python applications. In this chapter, we explored key tools such as `aiohttp`, FastAPI, Tornado, Sanic, and alternative libraries like Trio and Curio. Each of these tools has its own strengths and limitations, and the choice of the right one depends on the specific requirements of your project.