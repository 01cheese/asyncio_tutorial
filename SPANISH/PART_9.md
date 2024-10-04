## **Capítulo 9: Pruebas en Código Asíncrono**

### **9.1. Introducción a las Pruebas en Programación Asíncrona**

Las pruebas son una parte integral del desarrollo de aplicaciones confiables y resilientes. En el contexto de la programación asíncrona, las pruebas se vuelven más desafiantes debido a la ejecución paralela de tareas y las interacciones con recursos externos como redes o archivos. En este capítulo, exploraremos los métodos y herramientas que ayudan a probar de manera efectiva el código asíncrono en Python.

### **9.2. Herramientas para Probar Código Asíncrono**

Existen varias bibliotecas y frameworks específicamente diseñados para probar código asíncrono. Veamos las más populares:

#### **9.2.1. `pytest-asyncio`**

`pytest-asyncio` es un complemento para el framework `pytest` que permite escribir pruebas asíncronas utilizando corrutinas.

**Instalación:**

```bash
pip install pytest pytest-asyncio
```

#### **9.2.2. `asynctest`**

`asynctest` es una extensión del módulo estándar `unittest`, que proporciona soporte para pruebas asíncronas.

**Instalación:**

```bash
pip install asynctest
```

#### **9.2.3. `trio-testing`**

Para aquellos que utilizan la biblioteca `Trio`, existe `trio-testing`, que proporciona herramientas para probar corrutinas basadas en `Trio`.

**Instalación:**

```bash
pip install trio-testing
```

### **9.3. Escribiendo Pruebas para Funciones Asíncronas**

Exploremos cómo escribir pruebas para funciones asíncronas utilizando `pytest-asyncio`.

#### **9.3.1. Ejemplo de una Función Asíncrona**

```python
# async_module.py

import asyncio

async def fetch_data(delay, value):
    await asyncio.sleep(delay)
    return value
```

#### **9.3.2. Escribiendo una Prueba con `pytest-asyncio`**

```python
# test_async_module.py

import pytest
from async_module import fetch_data

@pytest.mark.asyncio
async def test_fetch_data():
    result = await fetch_data(1, "Hola")
    assert result == "Hola"
```

**Ejecutando las Pruebas:**

```bash
pytest
```

**Salida:**
```
============================= test session starts =============================
...
collected 1 item

test_async_module.py .                                               [100%]

============================== 1 passed in 1.01s ===============================
```

#### **9.3.3. Probando Excepciones en Funciones Asíncronas**

```python
# async_module.py

import asyncio

async def divide(a, b):
    await asyncio.sleep(1)
    return a / b
```

```python
# test_async_module.py

import pytest
from async_module import divide

@pytest.mark.asyncio
async def test_divide_success():
    result = await divide(10, 2)
    assert result == 5

@pytest.mark.asyncio
async def test_divide_zero_division():
    with pytest.raises(ZeroDivisionError):
        await divide(10, 0)
```

**Ejecutando las Pruebas:**

```bash
pytest
```

**Salida:**
```
============================= test session starts =============================
...
collected 2 items

test_async_module.py ..                                              [100%]

============================== 2 passed in 2.02s ===============================
```

### **9.4. Probando Aplicaciones Web Asíncronas**

Las aplicaciones web asíncronas requieren enfoques especiales para las pruebas, especialmente si interactúan con servicios externos o bases de datos.

#### **9.4.1. Ejemplo de Prueba de una Aplicación FastAPI**

Consideremos cómo probar una aplicación web asíncrona creada con FastAPI utilizando `pytest` y `httpx`.

**Ejemplo de Aplicación FastAPI:**

```python
# main.py

from fastapi import FastAPI

app = FastAPI()

@app.get("/hello")
async def read_hello():
    return {"message": "¡Hola, Mundo!"}
```

**Prueba para la Aplicación FastAPI:**

```python
# test_main.py

import pytest
from httpx import AsyncClient
from main import app

@pytest.mark.asyncio
async def test_read_hello():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/hello")
    assert response.status_code == 200
    assert response.json() == {"message": "¡Hola, Mundo!"}
```

**Ejecutando las Pruebas:**

```bash
pytest
```

**Salida:**
```
============================= test session starts =============================
...
collected 1 item

test_main.py .                                                    [100%]

============================== 1 passed in 0.50s ===============================
```

### **9.5. Mocking y Patching en Pruebas Asíncronas**

El mocking permite aislar el código bajo prueba de dependencias externas, como solicitudes de red o operaciones de bases de datos. Para el código asíncrono, se necesitan herramientas especiales para simular corrutinas.

#### **9.5.1. Usando `asynctest` para Mockear Corrutinas**

```python
# async_module.py

import asyncio

async def get_user(user_id):
    await asyncio.sleep(1)
    return {"id": user_id, "name": "Alicia"}

async def greet_user(user_id):
    user = await get_user(user_id)
    return f"¡Hola, {user['name']}!"
```

```python
# test_async_module.py

import asynctest
from async_module import greet_user

class TestGreetUser(asynctest.TestCase):
    async def test_greet_user(self):
        with asynctest.patch('async_module.get_user', return_value={"id": 1, "name": "Bob"}):
            greeting = await greet_user(1)
            self.assertEqual(greeting, "¡Hola, Bob!")
```

**Ejecutando las Pruebas:**

```bash
pytest
```

**Salida:**
```
============================= test session starts =============================
...
collected 1 item

test_async_module.py .                                              [100%]

============================== 1 passed in 1.01s ===============================
```

#### **9.5.2. Mockear Solicitudes HTTP Externas Usando `aiohttp` y `aresponses`**

```python
# async_module.py

import aiohttp
import asyncio

async def fetch_json(url):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.json()
```

```python
# test_async_module.py

import pytest
import aresponses
from async_module import fetch_json

@pytest.mark.asyncio
async def test_fetch_json(aresponses):
    aresponses.add(
        'api.example.com',
        '/data',
        'GET',
        aresponses.Response(text='{"key": "value"}', status=200)
    )
    
    url = 'http://api.example.com/data'
    result = await fetch_json(url)
    assert result == {"key": "value"}
```

**Instalando `aresponses`:**

```bash
pip install aresponses
```

**Ejecutando las Pruebas:**

```bash
pytest
```

**Salida:**
```
============================= test session starts =============================
...
collected 1 item

test_async_module.py .                                              [100%]

============================== 1 passed in 1.50s ===============================
```

### **9.6. Mejores Prácticas para Pruebas en Código Asíncrono**

1. **Aislar el Código Bajo Prueba:** Usa mocking para aislar de dependencias externas.
2. **Usar Herramientas Asíncronas:** Utiliza bibliotecas especializadas como `pytest-asyncio` o `asynctest`.
3. **Cubrir Diversos Escenarios:** Prueba tanto caminos exitosos como el manejo de errores.
4. **Mantener la Pureza de las Pruebas:** Cada prueba debe ser independiente y reproducible.
5. **Usar Fixtures:** Aplica fixtures de `pytest` para configurar y desmontar recursos.
6. **Automatizar las Pruebas:** Integra las pruebas en pipelines CI/CD para su ejecución automática al realizar cambios en el código.

### **9.7. Conclusión**

Probar código asíncrono requiere una atención especial a los detalles y el uso de herramientas especializadas. Las pruebas adecuadas aseguran la confiabilidad y la resiliencia de las aplicaciones, especialmente bajo alta carga y en interacciones con servicios externos. En este capítulo, exploramos los enfoques fundamentales para probar funciones asíncronas y aplicaciones web, así como métodos para mockear y parchear. Al seguir las mejores prácticas y utilizar las herramientas apropiadas, puedes crear aplicaciones asíncronas de alta calidad y confiables en Python.