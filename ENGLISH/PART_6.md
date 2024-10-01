## **Chapter 6: Asynchronous Input-Output Streams**

### **6.1. Introduction to Asynchronous Input-Output Streams**

In modern applications, input-output (I/O) operations play a key role. Whether you are working with network requests, files, databases, or other external resources, effective management of these operations is critical for the performance and responsiveness of your application. Asynchronous input-output streams allow these operations to be performed without blocking the main execution thread, thereby ensuring high performance and scalability.

### **6.2. Blocking vs. Non-Blocking I/O**

#### **6.2.1. Blocking I/O**

In traditional synchronous programming, input-output operations block the execution of the program until the operation completes. This means that if the program performs a long network request or reads a large file, it cannot perform other tasks until the operation finishes.

**Example of Blocking File Reading:**

```python
import time

def read_file(file_path):
    print(f"Start reading file: {file_path}")
    with open(file_path, 'r') as f:
        content = f.read()
    print(f"File {file_path} read.")
    return content

def main():
    start_time = time.time()
    read_file('example1.txt')
    read_file('example2.txt')
    end_time = time.time()
    print(f"Total reading time: {end_time - start_time} seconds")

if __name__ == "__main__":
    main()
```

**Output:**
```
Start reading file: example1.txt
File example1.txt read.
Start reading file: example2.txt
File example2.txt read.
Total reading time: 4.002 seconds
```

In this example, each file read operation blocks the program's execution until the operation completes, which can lead to delays in processing other tasks.

#### **6.2.2. Non-Blocking I/O**

Asynchronous (non-blocking) programming allows input-output operations to be performed without blocking the main execution thread. Instead of waiting for the operation to complete, the program can continue performing other tasks and handle the result as it becomes available.

**Example of Non-Blocking File Reading using `aiofiles`:**

```python
import asyncio
import aiofiles
import time

async def read_file(file_path):
    print(f"Start reading file: {file_path}")
    async with aiofiles.open(file_path, 'r') as f:
        content = await f.read()
    print(f"File {file_path} read.")
    return content

async def main():
    start_time = time.time()
    await asyncio.gather(
        read_file('example1.txt'),
        read_file('example2.txt')
    )
    end_time = time.time()
    print(f"Total reading time: {end_time - start_time} seconds")

if __name__ == "__main__":
    asyncio.run(main())
```

**Output:**
```
Start reading file: example1.txt
Start reading file: example2.txt
File example1.txt read.
File example2.txt read.
Total reading time: 2.003 seconds
```

In this example, two files are read simultaneously, which reduces the total execution time compared to the blocking approach.

### **6.3. Using `asyncio` Streams**

The `asyncio` module provides convenient interfaces for working with input-output streams through the `StreamReader` and `StreamWriter` classes. These classes allow asynchronous reading and writing of data without blocking the main event loop.

#### **6.3.1. Main Components of `asyncio` Streams**

- **StreamReader:** Provides methods for reading data from a stream.
- **StreamWriter:** Provides methods for writing data to a stream.
- **create_connection:** Function to create a connection and obtain `StreamReader` and `StreamWriter` objects.
- **start_server:** Function to start an asynchronous server that uses `StreamReader` and `StreamWriter` to communicate with clients.

#### **6.3.2. Example of an Asynchronous Echo Server and Client**

**Asynchronous Echo Server:**

```python
import asyncio

async def handle_client(reader, writer):
    addr = writer.get_extra_info('peername')
    print(f"New connection: {addr}")

    while True:
        data = await reader.readline()
        message = data.decode().strip()
        if not data:
            break
        print(f"Received from {addr}: {message}")
        writer.write(data)
        await writer.drain()

    print(f"Connection closed: {addr}")
    writer.close()
    await writer.wait_closed()

async def main():
    server = await asyncio.start_server(handle_client, '127.0.0.1', 8888)
    addr = server.sockets[0].getsockname()
    print(f"Server started on {addr}")

    async with server:
        await server.serve_forever()

if __name__ == "__main__":
    asyncio.run(main())
```

**Asynchronous Echo Client:**

```python
import asyncio

async def tcp_echo_client(message):
    reader, writer = await asyncio.open_connection('127.0.0.1', 8888)

    print(f"Sending: {message}")
    writer.write(f"{message}\n".encode())
    await writer.drain()

    data = await reader.readline()
    print(f"Received: {data.decode().strip()}")

    print("Closing connection")
    writer.close()
    await writer.wait_closed()

async def main():
    await asyncio.gather(
        tcp_echo_client("Hello, server!"),
        tcp_echo_client("How are you?"),
        tcp_echo_client("Asynchrony is cool!")
    )

if __name__ == "__main__":
    asyncio.run(main())
```

**Running:**

1. Run the server script.
2. Run the client script.

**Server Output:**
```
Server started on ('127.0.0.1', 8888)
New connection: ('127.0.0.1', 54321)
Received from ('127.0.0.1', 54321): Hello, server!
Received from ('127.0.0.1', 54321): How are you?
Received from ('127.0.0.1', 54321): Asynchrony is cool!
Connection closed: ('127.0.0.1', 54321)
```

**Client Output:**
```
Sending: Hello, server!
Received: Hello, server!
Closing connection
Sending: How are you?
Received: How are you?
Closing connection
Sending: Asynchrony is cool!
Received: Asynchrony is cool!
Closing connection
```

**Description:**

- **Server** listens for connections on localhost and port 8888. When a client connects, the server starts `handle_client`, which reads data line by line, prints the received messages, and sends them back to the client (echo).
- **Client** connects to the server, sends a message, waits for a response, and then closes the connection.

This example demonstrates how `asyncio` Streams can be used to create a simple and efficient asynchronous server and client.

### **6.4. Asynchronous Reading and Writing of Data**

Working with input-output streams involves reading and writing data. Asynchronous streams allow these operations to be performed efficiently without blocking the main execution thread.

#### **6.4.1. Asynchronous Data Reading**

**Example of Asynchronous Data Reading from a File using `aiofiles`:**

```python
import asyncio
import aiofiles

async def read_file(file_path):
    async with aiofiles.open(file_path, mode='r') as f:
        async for line in f:
            print(f"Reading line: {line.strip()}")
            await asyncio.sleep(0.1)  # Simulating processing

async def main():
    await read_file('example.txt')

if __name__ == "__main__":
    asyncio.run(main())
```

**Description:**

- The file is opened asynchronously using `aiofiles.open`.
- The file is read line by line using the asynchronous iterator `async for`.
- Simulating processing of each line using `await asyncio.sleep(0.1)`.

#### **6.4.2. Asynchronous Data Writing**

**Example of Asynchronous Data Writing to a File using `aiofiles`:**

```python
import asyncio
import aiofiles

async def write_file(file_path, data):
    async with aiofiles.open(file_path, mode='w') as f:
        for line in data:
            await f.write(f"{line}\n")
            print(f"Written line: {line}")
            await asyncio.sleep(0.1)  # Simulating delay

async def main():
    data = ["Line 1", "Line 2", "Line 3"]
    await write_file('output.txt', data)

if __name__ == "__main__":
    asyncio.run(main())
```

**Description:**

- Opening the file for writing asynchronously using `aiofiles.open`.
- Writing data line by line using an asynchronous loop.
- Simulating a delay after writing each line using `await asyncio.sleep(0.1)`.

### **6.5. Handling Multiple Input-Output Streams Simultaneously**

Asynchronous input-output streams allow handling multiple operations simultaneously, which significantly increases application performance.

#### **6.5.1. Example of Simultaneously Downloading Multiple Files**

**Asynchronous Downloading of Multiple Files using `aiohttp` and `aiofiles`:**

```python
import asyncio
import aiohttp
import aiofiles

async def download_file(session, url, dest):
    async with session.get(url) as response:
        response.raise_for_status()
        async with aiofiles.open(dest, 'wb') as f:
            while True:
                chunk = await response.content.read(1024)
                if not chunk:
                    break
                await f.write(chunk)
    print(f"File {dest} downloaded.")

async def main():
    urls = {
        'https://www.example.com/file1.jpg': 'file1.jpg',
        'https://www.example.com/file2.jpg': 'file2.jpg',
        'https://www.example.com/file3.jpg': 'file3.jpg',
    }

    async with aiohttp.ClientSession() as session:
        tasks = [
            download_file(session, url, dest)
            for url, dest in urls.items()
        ]
        await asyncio.gather(*tasks)

if __name__ == "__main__":
    asyncio.run(main())
```

**Description:**

- **`download_file`:** An asynchronous function for downloading a file. It reads the response content in chunks and writes it to a file.
- **`main`:** Creates a list of tasks for downloading all files and runs them in parallel using `asyncio.gather`.

#### **6.5.2. Example of Asynchronously Handling Multiple Network Connections**

**Asynchronous Server Handling Multiple Connections Simultaneously:**

```python
import asyncio

async def handle_client(reader, writer):
    addr = writer.get_extra_info('peername')
    print(f"New connection: {addr}")

    while True:
        data = await reader.read(100)
        if not data:
            break
        message = data.decode().strip()
        print(f"Received from {addr}: {message}")
        response = f"You said: {message}\n"
        writer.write(response.encode())
        await writer.drain()

    print(f"Connection closed: {addr}")
    writer.close()
    await writer.wait_closed()

async def main():
    server = await asyncio.start_server(handle_client, '127.0.0.1', 8888)
    addr = server.sockets[0].getsockname()
    print(f"Server started on {addr}")

    async with server:
        await server.serve_forever()

if __name__ == "__main__":
    asyncio.run(main())
```

**Description:**

- The server accepts connections from clients and starts `handle_client` for each connection.
- In `handle_client`, the server reads data from the client, sends a response, and continues to wait for new messages until the connection is closed.

### **6.6. Best Practices for Working with Asynchronous Input-Output Streams**

For effective use of asynchronous input-output streams, it is recommended to follow the following best practices:

#### **6.6.1. Use Asynchronous Libraries**

When working with input-output operations, use asynchronous libraries such as `aiohttp` for HTTP requests, `aiofiles` for file operations, etc. These libraries are designed to be compatible with `asyncio` and provide efficient execution of operations without blocking.

#### **6.6.2. Handle Exceptions**

Asynchronous operations can end with errors. Be sure to handle exceptions within coroutines to avoid unexpected application crashes.

**Example:**

```python
import asyncio
import aiohttp

async def fetch(session, url):
    try:
        async with session.get(url) as response:
            response.raise_for_status()
            return await response.text()
    except aiohttp.ClientError as e:
        print(f"Error fetching {url}: {e}")
    except asyncio.TimeoutError:
        print(f"Timeout fetching {url}")

async def main():
    urls = ['https://www.example.com', 'https://www.nonexistenturl.com']
    async with aiohttp.ClientSession() as session:
        tasks = [fetch(session, url) for url in urls]
        results = await asyncio.gather(*tasks)
        for result in results:
            if result:
                print(result[:100])  # Print the first 100 characters of the response

if __name__ == "__main__":
    asyncio.run(main())
```

#### **6.6.3. Limit the Number of Concurrent Operations**

To avoid overloading system resources or external services, limit the number of asynchronous operations performed simultaneously. This can be done using semaphores or task pools.

**Example using `asyncio.Semaphore`:**

```python
import asyncio
import aiohttp

async def fetch(session, url, semaphore):
    async with semaphore:
        async with session.get(url) as response:
            return await response.text()

async def main():
    urls = ['https://www.example.com' for _ in range(10)]
    semaphore = asyncio.Semaphore(3)  # Maximum 3 simultaneously
    async with aiohttp.ClientSession() as session:
        tasks = [fetch(session, url, semaphore) for url in urls]
        results = await asyncio.gather(*tasks)
        print(f"Received {len(results)} responses.")

if __name__ == "__main__":
    asyncio.run(main())
```

#### **6.6.4. Properly Close Resources**

Always close connections and files after use to prevent resource leaks. Use asynchronous context managers (`async with`) for automatic resource management.

#### **6.6.5. Use Logging Instead of `print`**

For large and complex applications, it is recommended to use the `logging` module instead of `print` for outputting messages. This allows better management of logging levels and directing messages to various destinations (console, files, etc.).

**Example:**

```python
import asyncio
import aiohttp
import logging

logging.basicConfig(level=logging.INFO)

async def fetch(session, url):
    try:
        async with session.get(url) as response:
            response.raise_for_status()
            text = await response.text()
            logging.info(f"Downloaded {url} with {len(text)} characters")
            return text
    except aiohttp.ClientError as e:
        logging.error(f"Error fetching {url}: {e}")

async def main():
    urls = ['https://www.example.com', 'https://www.python.org']
    async with aiohttp.ClientSession() as session:
        tasks = [fetch(session, url) for url in urls]
        await asyncio.gather(*tasks)

if __name__ == "__main__":
    asyncio.run(main())
```

### **6.7. Conclusion**

Asynchronous input-output streams are a powerful tool for creating high-performance and scalable applications in Python. Using `asyncio` Streams allows efficient management of network connections, file operations, and other input-output tasks without blocking the main execution thread. In this chapter, we covered the basic concepts of asynchronous I/O, learned how to create and manage streams using `asyncio`, and explored best practices for writing reliable and efficient asynchronous code.