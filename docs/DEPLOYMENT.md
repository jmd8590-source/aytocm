# Guía de Despliegue en Producción: Civitas

## 1. Despliegue Rápido con Docker Compose

La plataforma incluye soporte listo para ejecución contenerizada con PostgreSQL + PostGIS, backend Spring Boot y servidor Nginx para el frontend PWA.

### `docker-compose.yml`

```yaml
version: '3.8'

services:
  civitas-db:
    image: postgis/postgis:16-3.4
    container_name: civitas-db
    environment:
      POSTGRES_DB: civitas_db
      POSTGRES_USER: civitas_user
      POSTGRES_PASSWORD: ${DB_PASSWORD:-civitas_secure_pass}
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./backend-spring/src/main/resources/schema.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped

  civitas-backend:
    build:
      context: ./backend-spring
      dockerfile: Dockerfile
    container_name: civitas-backend
    environment:
      DB_URL: jdbc:postgresql://civitas-db:5432/civitas_db
      DB_USER: civitas_user
      DB_PASSWORD: ${DB_PASSWORD:-civitas_secure_pass}
      JWT_SECRET: ${JWT_SECRET:-404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970}
    ports:
      - "8080:8080"
    depends_on:
      - civitas-db
    restart: unless-stopped

  civitas-frontend:
    image: nginx:alpine
    container_name: civitas-frontend
    ports:
      - "80:80"
    volumes:
      - ./:/usr/share/nginx/html:ro
    restart: unless-stopped

volumes:
  pgdata:
```

---

## 2. Variables de Entorno Recomendadas

| Variable | Descripción | Valor por Defecto / Ejemplo |
|---|---|---|
| `DB_URL` | Cadena de conexión JDBC | `jdbc:postgresql://localhost:5432/civitas_db` |
| `DB_USER` | Usuario de base de datos | `civitas_user` |
| `DB_PASSWORD` | Contraseña cifrada | *(Definir en secretos)* |
| `JWT_SECRET` | Clave secreta HMAC 256 bits | *(Mínimo 256 bits base64)* |
| `SPRING_PROFILES_ACTIVE` | Perfil de Spring Boot | `prod` |

---

## 3. Comandos de Inicialización

```bash
# Iniciar todos los servicios
docker compose up -d

# Consultar logs del backend
docker compose logs -f civitas-backend

# Detener los servicios
docker compose down
```
