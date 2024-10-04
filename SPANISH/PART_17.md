## **Capítulo 17: Contenerización y Orquestación de Aplicaciones Asíncronas**

### **17.1. Introducción a la Contenerización y Orquestación**

La contenerización y orquestación se han convertido en partes fundamentales del desarrollo y despliegue moderno de aplicaciones. Permiten la creación de entornos de ejecución aislados, portátiles y escalables, lo cual es especialmente importante para las aplicaciones asíncronas que requieren alto rendimiento y fiabilidad.

**Objetivos de este Capítulo:**

- Comprender los conceptos de contenerización y orquestación.
- Aprender a crear imágenes de Docker para aplicaciones asíncronas.
- Explorar orquestadores de contenedores como Kubernetes.
- Revisar ejemplos de despliegue y escalado de aplicaciones asíncronas.

### **17.2. Contenerización con Docker**

Docker es una plataforma para desarrollar, enviar y ejecutar aplicaciones en contenedores aislados. Los contenedores garantizan la consistencia en el entorno de ejecución, simplificando el despliegue y escalado de aplicaciones.

#### **17.2.1. Creación de un Dockerfile para una Aplicación Asíncrona**

**Ejemplo de Dockerfile para una Aplicación Asíncrona con FastAPI:**

```dockerfile
# Usa la imagen oficial de Python como base
FROM python:3.11-slim

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de dependencias
COPY requirements.txt .

# Instala las dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copia el código fuente de la aplicación
COPY . .

# Crea un usuario no root
RUN adduser --disabled-password --gecos '' appuser

# Cambia al nuevo usuario
USER appuser

# Expone el puerto de la aplicación
EXPOSE 8000

# Define el comando para ejecutar la aplicación
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Explicación:**

1. **Imagen Base:** Se usa una imagen ligera de Python 3.11-slim para minimizar el tamaño del contenedor.
2. **Directorio de Trabajo:** El directorio de trabajo se establece en `/app`.
3. **Instalación de Dependencias:** Las dependencias se copian e instalan desde `requirements.txt`.
4. **Copia de Código:** Todo el código fuente de la aplicación se copia en el contenedor.
5. **Seguridad:** Se crea un usuario no root `appuser` para ejecutar la aplicación, mejorando la seguridad.
6. **Comando de Inicio:** La aplicación se lanza utilizando Uvicorn.

#### **17.2.2. Construcción y Ejecución de un Contenedor Docker**

**Construcción de la Imagen Docker:**

```bash
docker build -t myasyncapp:latest .
```

**Ejecución del Contenedor:**

```bash
docker run -d -p 8000:8000 --name myasyncapp myasyncapp:latest
```

**Explicación:**

- **`-d`**: Ejecuta el contenedor en modo desanclado.
- **`-p 8000:8000`**: Mapea el puerto 8000 del contenedor al puerto 8000 del host.
- **`--name myasyncapp`**: Asigna el nombre `myasyncapp` al contenedor.

### **17.3. Orquestación de Contenedores con Kubernetes**

Kubernetes es un potente orquestador de contenedores que automatiza el despliegue, escalado y gestión de aplicaciones contenerizadas.

#### **17.3.1. Conceptos Claves de Kubernetes**

- **Pod:** La unidad desplegable más pequeña en Kubernetes, que contiene uno o más contenedores.
- **Deployment:** Un objeto que gestiona réplicas de Pods y maneja actualizaciones de la aplicación.
- **Service:** Proporciona accesibilidad de red a Pods creando un punto de acceso estable.
- **Namespace:** Segrega los recursos del clúster para organización y aislamiento.

#### **17.3.2. Creación de un Manifesto de Deployment para una Aplicación Asíncrona**

**Ejemplo de `deployment.yaml`:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myasyncapp-deployment
  labels:
    app: myasyncapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myasyncapp
  template:
    metadata:
      labels:
        app: myasyncapp
    spec:
      containers:
      - name: myasyncapp
        image: mydockerhubuser/myasyncapp:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: DATABASE_URL
```

**Explicación:**

- **réplicas:** Número de copias del Pod para garantizar alta disponibilidad.
- **selector:** Determina qué Pods pertenecen a este Deployment.
- **template:** Define la plantilla del Pod, incluyendo los contenedores y sus configuraciones.
- **env:** Variables de entorno provenientes de Secrets de Kubernetes para el manejo seguro de datos sensibles.

#### **17.3.3. Creación de un Manifesto de Servicio para la Aplicación**

**Ejemplo de `service.yaml`:**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: myasyncapp-service
spec:
  selector:
    app: myasyncapp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8000
  type: LoadBalancer
```

**Explicación:**

- **selector:** Vincula el Servicio a los Pods etiquetados con `app: myasyncapp`.
- **ports:** Mapea el puerto 80 del Servicio al puerto 8000 del contenedor.
- **type: LoadBalancer:** Crea una dirección IP externa para acceder a la aplicación.

#### **17.3.4. Despliegue de la Aplicación en Kubernetes**

**Aplicación de los Manifiestos:**

```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

**Comprobación del Estado:**

```bash
kubectl get deployments
kubectl get pods
kubectl get services
```

**Explicación:**

- `kubectl apply` aplica los manifiestos y crea los recursos necesarios en el clúster.
- Los comandos `kubectl get` se usan para verificar el estado de los recursos desplegados.

### **17.4. Escalado Automático con Kubernetes**

El escalado automático permite ajustar dinámicamente el número de réplicas de Pods basado en la carga, asegurando una utilización eficiente de los recursos y alta disponibilidad.

#### **17.4.1. Horizontal Pod Autoscaler (HPA)**

HPA aumenta o disminuye automáticamente el número de réplicas de Deployment basado en métricas como el uso de CPU o métricas personalizadas.

**Ejemplo de Creación de un HPA:**

```bash
kubectl autoscale deployment myasyncapp-deployment --cpu-percent=50 --min=2 --max=10
```

**Explicación:**

- **`--cpu-percent=50`**: Porcentaje objetivo de utilización de CPU.
- **`--min=2`**: Número mínimo de réplicas.
- **`--max=10`**: Número máximo de réplicas.

#### **17.4.2. Comprobación del Estado del HPA**

```bash
kubectl get hpa
```

**Explicación:**

- Este comando muestra el estado actual del HPA, incluyendo el número de réplicas y las métricas actuales.

### **17.5. Integración Continua y Despliegue Continuo (CI/CD)**

Configurar pipelines de CI/CD automatiza los procesos de construcción, pruebas y despliegue de aplicaciones asíncronas, asegurando una entrega rápida y confiable de actualizaciones.

#### **17.5.1. Ejemplo de Pipeline CI/CD con GitHub Actions**

**Ejemplo de `.github/workflows/ci-cd.yml`:**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout Repository
      uses: actions/checkout@v3

    - name: Set Up Docker Buildx
      uses: docker/setup-buildx-action@v2

    - name: Log in to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}

    - name: Build Docker Image
      run: docker build -t mydockerhubuser/myasyncapp:latest .

    - name: Push Docker Image
      run: docker push mydockerhubuser/myasyncapp:latest

    - name: Set Up kubectl
      uses: azure/setup-kubectl@v3
      with:
        version: 'latest'

    - name: Deploy to Kubernetes
      run: |
        kubectl apply -f deployment.yaml
        kubectl apply -f service.yaml
```

**Explicación:**

1. **Disparador:** El pipeline se ejecuta en cada push a la rama `main`.
2. **Pasos:**
   - **Checkout:** Clona el repositorio.
   - **Docker Buildx:** Configura Docker Buildx para una construcción avanzada de imágenes.
   - **Inicio de Sesión en Docker:** Autentica con Docker Hub usando secretos de GitHub.
   - **Construcción y Push:** Construye la imagen Docker y la sube a Docker Hub.
   - **Configuración de kubectl:** Instala `kubectl` para interactuar con Kubernetes.
   - **Despliegue:** Aplica los manifiestos de Deployment y Service para desplegar las actualizaciones.

#### **17.5.2. Ejemplo de Pipeline CI/CD con GitLab CI/CD**

**Ejemplo de `.gitlab-ci.yml`:**

```yaml
stages:
  - build
  - deploy

variables:
  DOCKER_IMAGE: mydockerhubuser/myasyncapp:latest

build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t $DOCKER_IMAGE .
    - echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
    - docker push $DOCKER_IMAGE

deploy:
  stage: deploy
  image: bitnami/kubectl:latest
  script:
    - kubectl apply -f deployment.yaml
    - kubectl apply -f service.yaml
  only:
    - main
```

**Explicación:**

- **Etapas:**
  - **build:** Construye y empuja la imagen Docker.
  - **deploy:** Despliega la aplicación en Kubernetes.
- **Variables:** Define variables de entorno para la imagen Docker.
- **Secretos:** `DOCKER_USERNAME` y `DOCKER_PASSWORD` deben configurarse en GitLab CI/CD.
- **Condiciones:** El despliegue solo ocurre en pushes a la rama `main`.

### **17.6. Monitoreo y Registro (Logging)**

Un monitoreo y registro efectivos permiten rastrear el estado de la aplicación, identificar problemas y analizar el rendimiento.

#### **17.6.1. Integración con Prometheus y Grafana**

Prometheus es un sistema de monitoreo y alertas, mientras que Grafana es una herramienta para visualizar métricas.

**Ejemplo de Configuración de Monitoreo con Prometheus y Grafana:**

1. **Instalación de Prometheus y Grafana Usando Helm:**

    ```bash
    helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
    helm repo update
    helm install prometheus prometheus-community/prometheus
    helm install grafana prometheus-community/grafana
    ```

2. **Configuración de Exportadores de Métricas en la Aplicación:**

    **Ejemplo de Integración de Prometheus con FastAPI:**

    ```python
    from fastapi import FastAPI
    from prometheus_client import Counter, generate_latest, CONTENT_TYPE_LATEST
    from starlette.responses import Response
    import asyncio

    app = FastAPI()

    REQUEST_COUNT = Counter('http_requests_total', 'Total HTTP Requests', ['method', 'endpoint'])

    @app.middleware("http")
    async def add_metrics(request, call_next):
        REQUEST_COUNT.labels(method=request.method, endpoint=request.url.path).inc()
        response = await call_next(request)
        return response

    @app.get("/metrics")
    async def metrics():
        return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

    @app.get("/")
    async def read_root():
        await asyncio.sleep(1)  # Simula una operación asíncrona
        return {"message": "¡Hola, Prometheus!"}
    ```

3. **Configuración de Grafana para Mostrar Métricas:**

    - Abre la interfaz de Grafana.
    - Añade Prometheus como fuente de datos con la URL `http://prometheus-server`.
    - Crea dashboards y añade paneles para visualizar métricas como `http_requests_total` y otras.

#### **17.6.2. Recolección de Logs con ELK Stack**

El ELK Stack (Elasticsearch, Logstash, Kibana) es un conjunto de herramientas para recolectar, procesar y visualizar logs.

**Ejemplo de Configuración de Recolección de Logs Usando Filebeat:**

1. **Instalación de Filebeat:**

    ```bash
    helm repo add elastic https://helm.elastic.co
    helm repo update
    helm install filebeat elastic/filebeat -f filebeat-values.yaml
    ```

2. **Ejemplo de `filebeat-values.yaml`:**

    ```yaml
    filebeatConfig:
      filebeat.yml: |
        filebeat.inputs:
        - type: container
          paths:
            - /var/lib/docker/containers/*/*.log

        output.elasticsearch:
          hosts: ['http://elasticsearch:9200']
          username: elastic
          password: changeme
    ```

3. **Verificación de la Recolección de Logs:**

    - Asegúrate de que los logs se están enviando a Elasticsearch.
    - Usa Kibana para crear dashboards y analizar logs.

### **17.7. Seguridad de Contenedores y Orquestadores**

Asegurar la seguridad de los contenedores y orquestadores es crucial para proteger las aplicaciones y la infraestructura de posibles amenazas.

#### **17.7.1. Uso de Imágenes Base Mínimas**

Utilizar imágenes base mínimas, como `python:3.11-slim`, reduce la superficie de ataque y disminuye el tamaño de la imagen, acelerando las descargas y despliegues.

#### **17.7.2. Gestión de Secretos**

No almacenes datos sensibles como contraseñas y tokens en Dockerfiles o en el código. Utiliza Secrets de Kubernetes para gestionar información sensible.

**Ejemplo de Uso de `Secrets` en Kubernetes:**

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
data:
  username: dXNlcg==  # Cadena codificada en Base64 "user"
  password: cGFzc3dvcmQ=  # Cadena codificada en Base64 "password"
```

**Uso del Secret en un Deployment:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myasyncapp-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myasyncapp
  template:
    metadata:
      labels:
        app: myasyncapp
    spec:
      containers:
      - name: myasyncapp
        image: myasyncapp:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_USERNAME
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: username
        - name: DATABASE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: password
```

#### **17.7.3. Actualización y Parcheo de Contenedores**

Actualiza regularmente las imágenes base y las dependencias de la aplicación para evitar el uso de versiones vulnerables. Utiliza herramientas automáticas de escaneo de imágenes para detectar y remediar vulnerabilidades.

#### **17.7.4. Limitación de Privilegios de los Contenedores**

Ejecuta los contenedores con los mínimos privilegios necesarios. Evita ejecutar contenedores como el usuario `root` a menos que sea absolutamente necesario.

**Ejemplo de Configuración de un Usuario No Root en el Dockerfile:**

```dockerfile
# Añade un usuario
RUN adduser --disabled-password --gecos '' appuser

# Cambia al nuevo usuario
USER appuser
```

### **17.8. Ejemplos Prácticos de Despliegue y Escalado**

#### **17.8.1. Escalado Automático Usando Horizontal Pod Autoscaler (HPA)**

El Horizontal Pod Autoscaler ajusta automáticamente el número de réplicas de Deployment basado en la utilización de recursos.

**Ejemplo de Creación de un HPA para un Deployment:**

```bash
kubectl autoscale deployment myasyncapp-deployment --cpu-percent=50 --min=2 --max=10
```

**Descripción:**

- **`--cpu-percent=50`**: Porcentaje objetivo de utilización de CPU.
- **`--min=2`**: Número mínimo de réplicas.
- **`--max=10`**: Número máximo de réplicas.

#### **17.8.2. Despliegue sin Tiempo de Inactividad (Zero Downtime Deployment)**

Kubernetes soporta la estrategia `RollingUpdate`, que permite actualizar aplicaciones sin interrumpir la disponibilidad.

**Ejemplo de Actualización de la Imagen:**

```bash
kubectl set image deployment/myasyncapp-deployment myasyncapp=mydockerhubuser/myasyncapp:latest
```

#### **17.8.3. Despliegue de la Aplicación en Múltiples Zonas de Disponibilidad**

Para asegurar alta disponibilidad y tolerancia a fallos, despliega la aplicación en múltiples zonas de disponibilidad.

**Ejemplo de Manifesto de Deployment con Restricciones de Distribución de Topología:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myasyncapp-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myasyncapp
  template:
    metadata:
      labels:
        app: myasyncapp
    spec:
      topologySpreadConstraints:
      - maxSkew: 1
        topologyKey: failure-domain.beta.kubernetes.io/zone
        whenUnsatisfiable: DoNotSchedule
        labelSelector:
          matchLabels:
            app: myasyncapp
      containers:
      - name: myasyncapp
        image: myasyncapp:latest
        ports:
        - containerPort: 8000
```

**Explicación:**

- **`topologySpreadConstraints`**: Define cómo se distribuyen los Pods a través de las zonas.
- **`maxSkew`**: Desviación máxima en el número de Pods entre diferentes zonas.
- **`topologyKey`**: Clave de topología para la distribución (por ejemplo, zona de disponibilidad).
- **`whenUnsatisfiable`**: Comportamiento cuando no se puede cumplir la restricción (`DoNotSchedule` significa que nuevos Pods no se programarán hasta que se cumpla la condición).

### **17.9. Conclusión**

La contenerización y orquestación proporcionan herramientas poderosas para desplegar, gestionar y escalar aplicaciones asíncronas en Python. Utilizar Docker para crear entornos de ejecución aislados y Kubernetes para automatizar el despliegue y la gestión permite la creación de sistemas confiables y escalables.

---

¡Felicidades! Has completado todos los capítulos de nuestra guía sobre programación asíncrona en Python. Esperamos que este libro te haya ayudado a adquirir una comprensión más profunda de los principios asíncronos, dominar las herramientas y técnicas para desarrollar aplicaciones de alto rendimiento y fiabilidad.