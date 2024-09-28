## **Глава 9: Тестирование асинхронного кода**

### **9.1. Введение в тестирование асинхронного кода**

Тестирование является неотъемлемой частью разработки надежных и устойчивых приложений. В контексте асинхронного программирования тестирование приобретает дополнительные сложности из-за параллельного выполнения задач и взаимодействия с внешними ресурсами. В этой главе мы рассмотрим методы и инструменты, которые помогут эффективно тестировать асинхронный код в Python.

### **9.2. Инструменты для тестирования асинхронного кода**

Существует несколько библиотек и фреймворков, специально разработанных для тестирования асинхронного кода. Рассмотрим наиболее популярные из них:

#### **9.2.1. `pytest-asyncio`**

`pytest-asyncio` — это плагин для фреймворка `pytest`, который позволяет писать асинхронные тесты с использованием корутин.

**Установка:**

```bash
pip install pytest pytest-asyncio
```

#### **9.2.2. `asynctest`**

`asynctest` — это расширение стандартного модуля `unittest`, предоставляющее поддержку асинхронных тестов.

**Установка:**

```bash
pip install asynctest
```

#### **9.2.3. `trio-testing`**

Для тех, кто использует библиотеку `Trio`, существует `trio-testing`, предоставляющая инструменты для тестирования корутин на основе `Trio`.

**Установка:**

```bash
pip install trio-testing
```

### **9.3. Написание тестов для асинхронных функций**

Рассмотрим, как писать тесты для асинхронных функций с использованием `pytest-asyncio`.

#### **9.3.1. Пример асинхронной функции**

```python
# async_module.py

import asyncio

async def fetch_data(delay, value):
    await asyncio.sleep(delay)
    return value
```

#### **9.3.2. Написание теста с `pytest-asyncio`**

```python
# test_async_module.py

import pytest
from async_module import fetch_data

@pytest.mark.asyncio
async def test_fetch_data():
    result = await fetch_data(1, "Привет")
    assert result == "Привет"
```

**Запуск тестов:**

```bash
pytest
```

**Вывод:**

```
============================= test session starts =============================
...
collected 1 item

test_async_module.py .                                               [100%]

============================== 1 passed in 1.01s ==============================
```

#### **9.3.3. Тестирование исключений в асинхронных функциях**

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

**Запуск тестов:**

```bash
pytest
```

**Вывод:**

```
============================= test session starts =============================
...
collected 2 items

test_async_module.py ..                                              [100%]

============================== 2 passed in 2.02s ==============================
```

### **9.4. Тестирование асинхронных веб-приложений**

Асинхронные веб-приложения требуют специальных подходов к тестированию, особенно если они взаимодействуют с внешними сервисами или базами данных.

#### **9.4.1. Пример тестирования FastAPI приложения**

Рассмотрим, как тестировать асинхронное веб-приложение, созданное с помощью FastAPI, используя `pytest` и `httpx`.

**Пример FastAPI приложения:**

```python
# main.py

from fastapi import FastAPI

app = FastAPI()

@app.get("/hello")
async def read_hello():
    return {"message": "Привет, мир!"}
```

**Тест для FastAPI приложения:**

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
    assert response.json() == {"message": "Привет, мир!"}
```

**Запуск тестов:**

```bash
pytest
```

**Вывод:**

```
============================= test session starts =============================
...
collected 1 item

test_main.py .                                                    [100%]

============================== 1 passed in 0.50s ==============================
```

### **9.5. Мокирование и патчинг в асинхронных тестах**

Мокирование позволяет изолировать тестируемый код от внешних зависимостей, таких как сетевые запросы или операции с базами данных. Для асинхронного кода необходимо использовать специальные инструменты для мокирования корутин.

#### **9.5.1. Использование `asynctest` для мокирования корутин**

```python
# async_module.py

import asyncio

async def get_user(user_id):
    await asyncio.sleep(1)
    return {"id": user_id, "name": "Алиса"}

async def greet_user(user_id):
    user = await get_user(user_id)
    return f"Привет, {user['name']}!"
```

```python
# test_async_module.py

import asynctest
from async_module import greet_user

class TestGreetUser(asynctest.TestCase):
    async def test_greet_user(self):
        with asynctest.patch('async_module.get_user', return_value={"id": 1, "name": "Боб"}):
            greeting = await greet_user(1)
            self.assertEqual(greeting, "Привет, Боб!")
```

**Запуск тестов:**

```bash
pytest
```

**Вывод:**

```
============================= test session starts =============================
...
collected 1 item

test_async_module.py .                                              [100%]

============================== 1 passed in 1.01s ==============================
```

#### **9.5.2. Мокирование внешних HTTP-запросов с использованием `aiohttp` и `aresponses`**

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

**Установка `aresponses`:**

```bash
pip install aresponses
```

**Запуск тестов:**

```bash
pytest
```

**Вывод:**

```
============================= test session starts =============================
...
collected 1 item

test_async_module.py .                                              [100%]

============================== 1 passed in 1.50s ==============================
```

### **9.6. Лучшие практики для тестирования асинхронного кода**

1. **Изолируйте тестируемый код:** Используйте мокирование для изоляции от внешних зависимостей.
2. **Используйте асинхронные инструменты:** Применяйте специализированные библиотеки, такие как `pytest-asyncio` или `asynctest`.
3. **Покрывайте различные сценарии:** Тестируйте как успешные пути, так и обработку ошибок.
4. **Поддерживайте чистоту тестов:** Каждый тест должен быть независимым и воспроизводимым.
5. **Используйте фикстуры:** Применяйте фикстуры `pytest` для подготовки и очистки ресурсов.
6. **Автоматизируйте тестирование:** Включите тесты в CI/CD пайплайны для автоматического запуска при изменениях кода.

### **9.7. Заключение**

Тестирование асинхронного кода требует особого внимания к деталям и использования специализированных инструментов. Правильное тестирование обеспечивает надежность и устойчивость приложений, особенно в условиях высокой нагрузки и взаимодействия с внешними сервисами. В этой главе мы рассмотрели основные подходы к тестированию асинхронных функций, веб-приложений, а также методы мокирования и патчинга. Следуя лучшим практикам и используя подходящие инструменты, вы сможете создавать качественные и надежные асинхронные приложения на Python.