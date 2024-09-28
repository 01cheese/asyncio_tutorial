## **Глава 8: Обработка исключений в асинхронном коде**

### **8.1. Введение в обработку исключений в асинхронном программировании**

В асинхронном программировании обработка исключений играет ключевую роль в обеспечении надежности и устойчивости приложений. Поскольку асинхронный код часто выполняется параллельно и взаимодействует с внешними ресурсами, такие как сети или файлы, вероятность возникновения ошибок возрастает. Правильная обработка исключений позволяет предотвращать сбои приложения, управлять ошибками gracefully и обеспечивать корректное завершение задач.

### **8.2. Основы обработки исключений в асинхронном коде**

В Python обработка исключений осуществляется с помощью конструкции `try-except`. В асинхронном коде эта конструкция применяется аналогично синхронному коду, но с некоторыми особенностями, связанными с асинхронностью.

#### **8.2.1. Основная структура `try-except`**

```python
import asyncio

async def faulty_task():
    try:
        print("Начало выполнения задачи")
        await asyncio.sleep(1)
        raise ValueError("Произошла ошибка в задаче")
    except ValueError as e:
        print(f"Исключение поймано: {e}")
    finally:
        print("Завершение задачи")

async def main():
    await faulty_task()

if __name__ == "__main__":
        asyncio.run(main())
```

**Вывод:**
```
Начало выполнения задачи
Исключение поймано: Произошла ошибка в задаче
Завершение задачи
```

В этом примере асинхронная функция `faulty_task` генерирует исключение `ValueError`, которое перехватывается блоком `except`. Блок `finally` выполняется независимо от того, произошло исключение или нет.

#### **8.2.2. Обработка нескольких типов исключений**

Вы можете обрабатывать различные типы исключений, добавляя дополнительные блоки `except`.

```python
import asyncio

async def multiple_exceptions():
    try:
        await asyncio.sleep(1)
        # Генерация различных исключений
        raise (ValueError("Неправильное значение"))
    except ValueError as ve:
        print(f"Обработано ValueError: {ve}")
    except TypeError as te:
        print(f"Обработано TypeError: {te}")
    except Exception as e:
        print(f"Обработано общее исключение: {e}")
    finally:
        print("Завершение обработки исключений")

async def main():
    await multiple_exceptions()

if __name__ == "__main__":
    asyncio.run(main())
```

**Вывод:**
```
Обработано ValueError: Неправильное значение
Завершение обработки исключений
```

В этом примере функция `multiple_exceptions` может обрабатывать различные типы исключений, предоставляя более детализированную обработку ошибок.

### **8.3. Исключения в `asyncio.gather`**

Функция `asyncio.gather` используется для одновременного выполнения нескольких корутин. По умолчанию, если одна из корутин завершится с ошибкой, `asyncio.gather` поднимет исключение, и выполнение остальных корутин будет отменено. Однако, вы можете изменить это поведение с помощью параметра `return_exceptions`.

#### **8.3.1. Поведение по умолчанию**

```python
import asyncio

async def task_success():
    await asyncio.sleep(1)
    print("Задача успешно завершена")
    return "Успех"

async def task_failure():
    await asyncio.sleep(2)
    raise RuntimeError("Ошибка в задаче")

async def main():
    try:
        results = await asyncio.gather(task_success(), task_failure())
    except RuntimeError as e:
        print(f"Исключение из gather: {e}")

if __name__ == "__main__":
    asyncio.run(main())
```

**Вывод:**
```
Задача успешно завершена
Исключение из gather: Ошибка в задаче
```

В этом примере, несмотря на успешное завершение первой задачи, возникновение ошибки во второй приводит к тому, что `asyncio.gather` поднимает исключение `RuntimeError`.

#### **8.3.2. Обработка исключений с `return_exceptions=True`**

Если установить `return_exceptions=True`, `asyncio.gather` вернет все результаты, включая исключения, вместо поднятия первого возникшего исключения.

```python
import asyncio

async def task_success():
    await asyncio.sleep(1)
    print("Задача успешно завершена")
    return "Успех"

async def task_failure():
    await asyncio.sleep(2)
    raise RuntimeError("Ошибка в задаче")

async def main():
    results = await asyncio.gather(task_success(), task_failure(), return_exceptions=True)
    for result in results:
        if isinstance(result, Exception):
            print(f"Исключение получено: {result}")
        else:
            print(f"Результат: {result}")

if __name__ == "__main__":
    asyncio.run(main())
```

**Вывод:**
```
Задача успешно завершена
Исключение получено: Ошибка в задаче
Результат: Успех
```

В этом примере обе задачи завершаются независимо друг от друга, и все результаты (включая исключения) доступны для дальнейшей обработки.

### **8.4. Исключения в фоновых задачах**

Фоновые задачи (`asyncio.create_task`) могут завершаться с ошибками, которые не всегда явно обрабатываются. Если исключение в фоновой задаче не обрабатывается, оно может привести к предупреждениям и потенциальным утечкам ресурсов.

#### **8.4.1. Пример необработанного исключения в фоновой задаче**

```python
import asyncio

async def faulty_task():
    await asyncio.sleep(1)
    raise ValueError("Ошибка в фоновой задаче")

async def main():
    task = asyncio.create_task(faulty_task())
    await asyncio.sleep(2)

if __name__ == "__main__":
    asyncio.run(main())
```

**Вывод:**
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
  File "C:\Python39\lib\asyncio\base_events.py", line 618, in _add_to_selector
    self._selector.register(fileobj, events, data)
  File "C:\Python39\lib\selectors.py", line 507, in register
    key = self._selector.register(fileobj, events, data)
ValueError: unsupported operation on closed file.
```

Это предупреждение указывает на то, что исключение в фоновой задаче не было обработано.

#### **8.4.2. Правильная обработка исключений в фоновых задачах**

Чтобы избежать подобных проблем, необходимо явно обрабатывать исключения в фоновых задачах.

**Пример:**

```python
import asyncio

async def faulty_task():
    try:
        await asyncio.sleep(1)
        raise ValueError("Ошибка в фоновой задаче")
    except ValueError as e:
        print(f"Исключение в фоновой задаче обработано: {e}")

async def main():
    task = asyncio.create_task(faulty_task())
    await asyncio.sleep(2)

if __name__ == "__main__":
    asyncio.run(main())
```

**Вывод:**
```
Исключение в фоновой задаче обработано: Ошибка в фоновой задаче
```

В этом примере исключение внутри фоновой задачи обрабатывается внутри самой задачи, предотвращая появление необработанных исключений.

### **8.5. Использование `asyncio.shield` для защиты корутин от отмены и ошибок**

`asyncio.shield` позволяет защитить корутину от отмены или ошибок, сохраняя её выполнение независимо от внешних условий.

#### **8.5.1. Пример использования `asyncio.shield`**

```python
import asyncio

async def critical_task():
    try:
        print("Критическая задача началась")
        await asyncio.sleep(3)
        print("Критическая задача завершена")
    except asyncio.CancelledError:
        print("Критическая задача была отменена")

async def main():
    task = asyncio.create_task(asyncio.shield(critical_task()))
    await asyncio.sleep(1)
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        print("Задача была отменена, но shield защитил критическую задачу")

if __name__ == "__main__":
    asyncio.run(main())
```

**Вывод:**
```
Критическая задача началась
Задача была отменена, но shield защитил критическую задачу
Критическая задача завершена
```

В этом примере использование `asyncio.shield` предотвращает отмену `critical_task`, даже если основная задача была отменена.

#### **8.5.2. Применение `asyncio.shield` для управления жизненным циклом задач**

`asyncio.shield` полезен, когда вы хотите гарантировать выполнение определенных корутин, даже если основной цикл событий сталкивается с ошибками или отменой задач.

### **8.6. Контекстные менеджеры для обработки исключений**

Контекстные менеджеры позволяют управлять ресурсами и обеспечивать их корректное освобождение даже в случае возникновения исключений.

#### **8.6.1. Использование `async with` для обработки исключений**

```python
import asyncio

class AsyncResource:
    async def __aenter__(self):
        print("Ресурс открыт")
        return self

    async def __aexit__(self, exc_type, exc, tb):
        if exc:
            print(f"Исключение: {exc}")
        print("Ресурс закрыт")
        return False  # Пропуск исключения дальше

async def main():
    try:
        async with AsyncResource() as resource:
            print("Использование ресурса")
            raise RuntimeError("Ошибка во время использования ресурса")
    except RuntimeError as e:
        print(f"Исключение поймано в main: {e}")

if __name__ == "__main__":
    asyncio.run(main())
```

**Вывод:**
```
Ресурс открыт
Использование ресурса
Исключение: Ошибка во время использования ресурса
Ресурс закрыт
Исключение поймано в main: Ошибка во время использования ресурса
```

В этом примере контекстный менеджер `AsyncResource` обеспечивает корректное закрытие ресурса даже при возникновении исключения внутри блока `async with`.

### **8.7. Логирование исключений**

Использование модуля `logging` для регистрации исключений является хорошей практикой, особенно в больших и сложных приложениях.

#### **8.7.1. Настройка логирования**

```python
import asyncio
import logging

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def faulty_task():
    await asyncio.sleep(1)
    raise ValueError("Произошла ошибка в задаче")

async def main():
    try:
        await faulty_task()
    except ValueError as e:
        logger.error(f"Исключение поймано в main: {e}")

if __name__ == "__main__":
    asyncio.run(main())
```

**Вывод:**
```
ERROR:__main__:Исключение поймано в main: Произошла ошибка в задаче
```

В этом примере исключение логируется с уровнем `ERROR`, что позволяет отслеживать ошибки в приложении.

#### **8.7.2. Логирование исключений в фоновых задачах**

```python
import asyncio
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def faulty_task():
    await asyncio.sleep(1)
    raise ValueError("Ошибка в фоновой задаче")

async def main():
    task = asyncio.create_task(faulty_task())

    try:
        await task
    except Exception as e:
        logger.exception("Исключение в фоновой задаче")

if __name__ == "__main__":
    asyncio.run(main())
```

**Вывод:**
```
ERROR:__main__:Исключение в фоновой задаче
Traceback (most recent call last):
  File "async_exception.py", line 9, in faulty_task
    raise ValueError("Ошибка в фоновой задаче")
ValueError: Ошибка в фоновой задаче
```

Использование `logger.exception` автоматически включает трассировку стека, что облегчает отладку.

### **8.8. Практические примеры обработки исключений**

#### **8.8.1. Асинхронный HTTP-клиент с обработкой ошибок**

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
            logger.info(f"Скачано {url} длиной {len(data)} символов")
            return data
    except aiohttp.ClientError as e:
        logger.error(f"Ошибка при запросе {url}: {e}")
    except asyncio.TimeoutError:
        logger.error(f"Тайм-аут при запросе {url}")

async def main():
    urls = [
        'https://www.example.com',
        'https://www.nonexistenturl.com',
        'https://httpbin.org/delay/6',  # Тайм-аут
    ]
    async with aiohttp.ClientSession() as session:
        tasks = [fetch(session, url) for url in urls]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        for result in results:
            if isinstance(result, Exception):
                logger.error(f"Получено исключение: {result}")
            elif result:
                logger.info(f"Результат: {result[:100]}...")

if __name__ == "__main__":
    asyncio.run(main())
```

**Вывод:**
```
INFO:__main__:Скачано https://www.example.com длиной 1256 символов
ERROR:__main__:Ошибка при запросе https://www.nonexistenturl.com: Cannot connect to host www.nonexistenturl.com:443 ssl:default [Name or service not known]
ERROR:__main__:Тайм-аут при запросе https://httpbin.org/delay/6
ERROR:__main__:Получено исключение: Cannot connect to host www.nonexistenturl.com:443 ssl:default [Name or service not known]
ERROR:__main__:Получено исключение: Тайм-аут при запросе https://httpbin.org/delay/6
INFO:__main__:Результат: <HTML>... 
```

В этом примере асинхронный HTTP-клиент выполняет запросы к нескольким URL-адресам, обрабатывая различные типы ошибок, такие как недоступные хосты и тайм-ауты.

#### **8.8.2. Асинхронный веб-сервер с обработкой ошибок**

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
            raise web.HTTPBadRequest(text="Missing 'value' field")
        result = int(data['value']) * 2
        return web.json_response({"result": result})
    except web.HTTPException as e:
        raise e
    except Exception as e:
        logger.exception("Необработанное исключение")
        raise web.HTTPInternalServerError(text="Внутренняя ошибка сервера")

app = web.Application()
app.add_routes([web.post('/multiply', handle)])

if __name__ == '__main__':
    web.run_app(app, host='127.0.0.1', port=8080)
```

**Описание:**

- Сервер принимает POST-запросы на маршрут `/multiply`.
- Ожидает JSON-данные с полем `value`.
- Если поле отсутствует, возвращает ошибку `400 Bad Request`.
- Если происходит другая ошибка, логирует ее и возвращает `500 Internal Server Error`.

**Пример запроса с помощью `curl`:**

```bash
curl -X POST -H "Content-Type: application/json" -d '{"value": 10}' http://127.0.0.1:8080/multiply
```

**Ответ:**
```json
{
  "result": 20
}
```

**Пример запроса с отсутствующим полем `value`:**

```bash
curl -X POST -H "Content-Type: application/json" -d '{"number": 10}' http://127.0.0.1:8080/multiply
```

**Ответ:**
```
Missing 'value' field
```

### **8.9. Советы и рекомендации по обработке исключений**

#### **8.9.1. Обрабатывайте специфические исключения прежде, чем общие**

Всегда обрабатывайте более специфичные исключения перед общими. Это позволяет точнее управлять ошибками и предоставлять более детализированные сообщения.

```python
try:
    # Код, который может вызвать исключения
    pass
except ValueError:
    # Обработка ValueError
    pass
except Exception:
    # Обработка всех остальных исключений
    pass
```

#### **8.9.2. Используйте `finally` для очистки ресурсов**

Блок `finally` гарантирует выполнение кода независимо от того, произошло исключение или нет, что полезно для освобождения ресурсов.

```python
async def process():
    try:
        resource = await acquire_resource()
        # Работа с ресурсом
    except Exception as e:
        logger.error(f"Ошибка: {e}")
    finally:
        await release_resource(resource)
```

#### **8.9.3. Не подавляйте исключения без необходимости**

Избегайте использования пустых блоков `except`, которые подавляют все исключения без их обработки. Это может затруднить отладку и привести к скрытым ошибкам.

```python
# Плохо:
try:
    # Код
    pass
except:
    pass

# Хорошо:
try:
    # Код
    pass
except SpecificException as e:
    # Обработка конкретного исключения
    pass
```

#### **8.9.4. Логируйте исключения для отладки**

Используйте модуль `logging` для регистрации исключений, что облегчает их отслеживание и отладку.

```python
import logging

logger = logging.getLogger(__name__)

try:
    # Код, который может вызвать исключение
    pass
except Exception as e:
    logger.exception("Произошла ошибка")
```

### **8.10. Заключение**

Обработка исключений в асинхронном программировании на Python требует внимательного подхода для обеспечения надежности и устойчивости приложений. Правильное использование конструкций `try-except`, управление исключениями в фоновых задачах, использование `asyncio.shield` для защиты критических корутин и применение контекстных менеджеров позволяют эффективно управлять ошибками и предотвращать сбои приложений.