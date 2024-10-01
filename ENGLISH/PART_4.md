## **Chapter 4: `async` and `await` Syntax**

### **4.1. Introduction to `async` and `await`**

The keywords `async` and `await` are the primary building blocks of asynchronous programming in Python. They allow developers to write code that executes asynchronously, making it more readable and manageable compared to traditional callback-based approaches.

#### **4.1.1. History of `async` and `await`**

Before the introduction of `async` and `await` in Python 3.5, asynchronous programming was implemented using generators and specialized libraries such as `asyncio`, `Twisted`, and `gevent`. This approach was powerful but complex to understand and use. The introduction of `async` and `await` significantly simplified writing asynchronous code, making it resemble synchronous programming styles.

### **4.2. The `async` Keyword**

The `async` keyword is used to declare asynchronous functions, also known as coroutines. An asynchronous function is a function that can suspend its execution and resume later, allowing other tasks to run in the meantime.

#### **4.2.1. Syntax for Declaring an Asynchronous Function**

An asynchronous function is declared using the `async` keyword before `def`.

```python
async def my_async_function():
    pass
```

#### **4.2.2. Example of a Simple Asynchronous Function**

```python
import asyncio

async def greet(name):
    print(f"Hello, {name}!")
    await asyncio.sleep(1)
    print(f"Goodbye, {name}!")

# Running the coroutine
asyncio.run(greet("Alice"))
```

**Output:**
```
Hello, Alice!
Goodbye, Alice!
```

In this example, the `greet` function is asynchronous. It prints a greeting, waits for 1 second, and then prints a farewell. The `await` keyword allows the coroutine to pause its execution without blocking the main thread.

### **4.3. The `await` Keyword**

The `await` keyword is used to suspend the execution of a coroutine until another asynchronous operation completes. This allows for efficient management of asynchronous tasks and avoids blocking.

#### **4.3.1. Syntax for Using `await`**

```python
result = await some_async_function()
```

#### **4.3.2. Example of Using `await`**

```python
import asyncio

async def fetch_data():
    print("Starting data fetch...")
    await asyncio.sleep(2)  # Simulating an asynchronous operation
    print("Data fetched.")
    return {"data": "Sample data"}

async def process_data(data):
    print("Starting data processing...")
    await asyncio.sleep(1)  # Simulating asynchronous processing
    print("Data processed.")
    return f"Result: {data['data']}"

async def main():
    data = await fetch_data()
    result = await process_data(data)
    print(result)

if __name__ == "__main__":
    asyncio.run(main())
```

**Output:**
```
Starting data fetch...
Data fetched.
Starting data processing...
Data processed.
Result: Sample data
```

In this example, `await` is used to wait for the completion of the `fetch_data` and `process_data` functions without blocking the main execution thread.

### **4.4. Interaction Between `async` and `await`**

`async` and `await` work together to create asynchronous coroutines that can pause and resume their execution. This allows writing asynchronous code that looks and reads like synchronous code while executing asynchronously.

#### **4.4.1. Asynchronous Chain of Calls**

```python
import asyncio

async def task1():
    print("Task 1: Start")
    await asyncio.sleep(1)
    print("Task 1: Complete")
    return "Task 1 Result"

async def task2():
    print("Task 2: Start")
    await asyncio.sleep(2)
    print("Task 2: Complete")
    return "Task 2 Result"

async def main():
    result1 = await task1()
    result2 = await task2()
    print(result1)
    print(result2)

if __name__ == "__main__":
    asyncio.run(main())
```

**Output:**
```
Task 1: Start
Task 1: Complete
Task 2: Start
Task 2: Complete
Task 1 Result
Task 2 Result
```

In this example, tasks are executed sequentially despite being asynchronous. For parallel execution, additional tools like `asyncio.gather` are needed.

### **4.5. Creating and Running Coroutines**

Coroutines can be run in various ways depending on the context and application requirements.

#### **4.5.1. Using `asyncio.run`**

`asyncio.run` is a convenient function available from Python 3.7 onwards that creates an event loop, runs the coroutine, and closes the loop upon completion.

```python
import asyncio

async def say_hello():
    print("Hello!")
    await asyncio.sleep(1)
    print("World!")

asyncio.run(say_hello())
```

**Output:**
```
Hello!
World!
```

#### **4.5.2. Manually Using the Event Loop**

For more flexible event loop management, you can create and manage the loop manually.

```python
import asyncio

async def greet(name):
    print(f"Hello, {name}!")
    await asyncio.sleep(1)
    print(f"Goodbye, {name}!")

# Creating the event loop
loop = asyncio.get_event_loop()

# Running the coroutine
loop.run_until_complete(greet("Bob"))

# Closing the event loop
loop.close()
```

**Output:**
```
Hello, Bob!
Goodbye, Bob!
```

#### **4.5.3. Running Multiple Coroutines Simultaneously with `asyncio.gather`**

`asyncio.gather` allows running multiple coroutines concurrently and waiting for their completion.

```python
import asyncio

async def task1():
    await asyncio.sleep(1)
    print("Task 1 completed")

async def task2():
    await asyncio.sleep(2)
    print("Task 2 completed")

async def main():
    await asyncio.gather(task1(), task2())

if __name__ == "__main__":
    asyncio.run(main())
```

**Output:**
```
Task 1 completed
Task 2 completed
```

In this example, both tasks start simultaneously, and the total execution time is approximately 2 seconds instead of 3 seconds if executed sequentially.

### **4.6. Practical Examples of Using `async` and `await`**

Let's explore several practical examples demonstrating the use of `async` and `await` in various contexts.

#### **4.6.1. Asynchronous File Reading Using `aiofiles`**

```python
import asyncio
import aiofiles

async def read_file(file_path):
    async with aiofiles.open(file_path, mode='r') as f:
        contents = await f.read()
        print(contents)

async def main():
    await read_file('example.txt')

if __name__ == "__main__":
    asyncio.run(main())
```

**Description:**
This example uses the `aiofiles` library for asynchronous file reading. This allows the program to continue executing other tasks while the file is being read.

#### **4.6.2. Asynchronous HTTP Requests Using `aiohttp`**

```python
import asyncio
import aiohttp

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

**Description:**
This example demonstrates making an asynchronous HTTP request using the `aiohttp` library. Asynchronous requests allow sending and receiving data without blocking the main execution thread.

#### **4.6.3. Asynchronous Processing of Multiple Tasks with `asyncio.gather`**

```python
import asyncio

async def download_file(file_id):
    print(f"Starting download of file {file_id}")
    await asyncio.sleep(2)  # Simulating a download
    print(f"Download of file {file_id} completed")
    return f"File {file_id}"

async def main():
    tasks = [download_file(i) for i in range(1, 4)]
    results = await asyncio.gather(*tasks)
    print("All files downloaded:")
    for result in results:
        print(result)

if __name__ == "__main__":
    asyncio.run(main())
```

**Output:**
```
Starting download of file 1
Starting download of file 2
Starting download of file 3
Download of file 1 completed
Download of file 2 completed
Download of file 3 completed
All files downloaded:
File 1
File 2
File 3
```

**Description:**
In this example, three file download tasks are executed concurrently using `asyncio.gather`, significantly reducing the total execution time.

### **4.7. Managing Execution Time and Delays**

Asynchronous programming allows efficient management of task execution time and the use of delays without blocking the main thread.

#### **4.7.1. Using `asyncio.sleep` to Create Delays**

`asyncio.sleep` is the asynchronous version of `time.sleep`, which suspends the coroutine's execution for a specified time without blocking the event loop.

```python
import asyncio

async def delayed_message(message, delay):
    await asyncio.sleep(delay)
    print(message)

async def main():
    await asyncio.gather(
        delayed_message("Message after 1 second", 1),
        delayed_message("Message after 2 seconds", 2),
        delayed_message("Message after 3 seconds", 3),
    )

if __name__ == "__main__":
    asyncio.run(main())
```

**Output:**
```
Message after 1 second
Message after 2 seconds
Message after 3 seconds
```

#### **4.7.2. Limiting Execution Time with `asyncio.wait_for`**

`asyncio.wait_for` allows setting a timeout for a coroutine, after which it will be canceled if it hasn't completed.

```python
import asyncio

async def long_running_task():
    await asyncio.sleep(5)
    print("Long-running task completed")

async def main():
    try:
        await asyncio.wait_for(long_running_task(), timeout=3)
    except asyncio.TimeoutError:
        print("Task exceeded time limit and was canceled")

if __name__ == "__main__":
    asyncio.run(main())
```

**Output:**
```
Task exceeded time limit and was canceled
```

**Description:**
In this example, `long_running_task` simulates a long operation that doesn't complete within the set timeout, leading to its cancellation.

### **4.8. Handling Exceptions in Asynchronous Functions**

Exception handling in asynchronous functions is similar to synchronous code but requires attention to where and how exceptions are handled.

#### **4.8.1. Handling Exceptions Within a Coroutine**

```python
import asyncio

async def faulty_task():
    await asyncio.sleep(1)
    raise ValueError("An error occurred in the coroutine")

async def main():
    try:
        await faulty_task()
    except ValueError as e:
        print(f"Exception caught: {e}")

if __name__ == "__main__":
    asyncio.run(main())
```

**Output:**
```
Exception caught: An error occurred in the coroutine
```

#### **4.8.2. Handling Exceptions When Using `asyncio.gather`**

When using `asyncio.gather`, exceptions in coroutines can be aggregated. By default, if any coroutine raises an exception, `asyncio.gather` will raise it.

```python
import asyncio

async def task_success():
    await asyncio.sleep(1)
    print("Task completed successfully")

async def task_failure():
    await asyncio.sleep(2)
    raise RuntimeError("Error in task")

async def main():
    try:
        await asyncio.gather(task_success(), task_failure())
    except RuntimeError as e:
        print(f"Exception from gather: {e}")

if __name__ == "__main__":
    asyncio.run(main())
```

**Output:**
```
Task completed successfully
Exception from gather: Error in task
```

**Description:**
In this example, `task_failure` raises an error, which is caught in the `try-except` block within the `main` function.

#### **4.8.3. Using `asyncio.shield` to Protect Coroutines from Cancellation**

`asyncio.shield` allows protecting a coroutine from being canceled, ensuring its execution continues even if an external task is canceled.

```python
import asyncio

async def critical_task():
    print("Critical task started")
    await asyncio.sleep(3)
    print("Critical task completed")

async def main():
    task = asyncio.create_task(asyncio.shield(critical_task()))
    await asyncio.sleep(1)
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        print("Task was canceled, but the critical task continues to run")

if __name__ == "__main__":
    asyncio.run(main())
```

**Output:**
```
Critical task started
Task was canceled, but the critical task continues to run
Critical task completed
```

**Description:**
In this example, using `asyncio.shield` prevents the `critical_task` from being canceled even when the external task is canceled.

### **4.9. Conclusion**

The `async` and `await` keywords are fundamental elements of asynchronous programming in Python. They enable writing asynchronous code that is easy to read and maintain while efficiently utilizing system resources. In this chapter, we explored how to declare asynchronous functions, use `await` to suspend coroutine execution, run coroutines, and manage task execution time. We also examined practical examples of using these keywords in various contexts.

Understanding the syntax of `async` and `await` is a crucial step toward mastering asynchronous programming. In the following chapters, we will delve deeper into the workings of the `asyncio` module, study its core components, and learn to create more complex asynchronous applications.