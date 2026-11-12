# UnaHur Anti-Social Net — TP2 (MongoDB) — Grupo 6

Backend de la red social **UnaHur Anti-Social Net**, segunda etapa: la misma API del TP1, con la persistencia migrada de una base relacional (Sequelize) a **MongoDB** con **Mongoose**.

## Integrantes

| Integrante | Parte |
|---|---|
| Franco Nebuloni | Base y modelado: estructura, conexión a MongoDB, variables de entorno, schemas de Mongoose, diagrama y `validarReferencia` |
| Guillermo Guevara | User y Tag: rutas, controladores, schemas de Joi, manejo de errores y códigos HTTP |
| Gaston Alvarez | Post y Post_Images: CRUD de posts, imágenes y asociación de tags |
| Miguel Ignacio Sanchez | Comment: CRUD de comentarios y filtro por antigüedad |
| Alexander Ezequiel Bazan | Documentación y pruebas: Swagger y colección de Postman |

## Tecnologías

- **Node.js** y **Express 5**
- **MongoDB 8** (con Docker) y **Mongoose 9**
- **Redis** para la caché de los posts (bonus 3)
- **Joi** para validar los datos que llegan en el body
- **dotenv** para las variables de entorno
- **swagger-ui-express** y **js-yaml** para la documentación
- **nodemon** para desarrollo

## Requisitos

- [Node.js](https://nodejs.org/) y npm
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (para levantar MongoDB y Redis)
- git

## Cómo levantar el proyecto desde cero

### 1. Clonar el repositorio e instalar dependencias

```bash
git clone https://gitea.unahur.edu.ar/Estrategia-de-persistencia-C2-2026/trabajo-practico-2-grupo-6.git
cd trabajo-practico-2-grupo-6
npm install
```

### 2. Configurar las variables de entorno

Crear un archivo `.env` en la raíz del proyecto (si no existe) con este contenido:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/unaHur
COMMENT_MAX_AGE_MONTHS=6
REDIS_URL=redis://localhost:6379
```

### 3. Levantar MongoDB y Redis con Docker

En la raíz del proyecto está el archivo `compose.yaml`, que levanta MongoDB, **mongo-express** (una interfaz web para ver la base) y **Redis** (para la caché):

```yaml
services:
  mongodb:
    image: mongo:8.0
    ports:
      - "127.0.0.1:27017:27017"
    volumes:
      - mongodb_data:/data/db

  mongo-express:
    image: mongo-express:1.0.2
    ports:
      - "127.0.0.1:8081:8081"
    environment:
      ME_CONFIG_MONGODB_URL: mongodb://mongodb:27017/
      ME_CONFIG_BASICAUTH: "false"
    depends_on:
      - mongodb

  redis:
    image: redis:7
    ports:
      - "127.0.0.1:6379:6379"

volumes:
  mongodb_data:
```

Con Docker Desktop abierto, ejecutar:

```bash
docker compose up -d
```

Para verificar que esté corriendo:

```bash
docker compose ps
```

mongo-express queda disponible en `http://localhost:8081`.

> Si ya tenés MongoDB (puerto 27017) y Redis (puerto 6379) instalados localmente, podés saltear este paso.

### 4. Iniciar el servidor

```bash
npm run dev
```

La consola tiene que mostrar:

```
MongoDB conectado exitosamente
Redis conectado exitosamente
Servidor escuchando en http://localhost:3000
```

La base `unaHur` y sus colecciones se crean solas la primera vez que se guarda un documento.

### Problemas comunes

- **`ECONNREFUSED 127.0.0.1:27017`**: MongoDB no está corriendo. Abrir Docker Desktop y ejecutar `docker compose up -d`.
- **`ECONNREFUSED ::1:27017`**: en algunas versiones de Node, `localhost` se resuelve a IPv6. Cambiar `localhost` por `127.0.0.1` en `MONGO_URI`.
- **`Cannot find module ...`**: faltan dependencias. Ejecutar `npm install`.
- **`ECONNREFUSED 127.0.0.1:6379`**: Redis no está corriendo. Ejecutar `docker compose up -d`.

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto en el que escucha el servidor. Si no se define, usa `3000`. | `3000` |
| `MONGO_URI` | Cadena de conexión a MongoDB (incluye el nombre de la base). Obligatoria. | `mongodb://localhost:27017/unaHur` |
| `COMMENT_MAX_AGE_MONTHS` | Antigüedad máxima, en meses, de los comentarios que se muestran. Tiene que ser un entero positivo. | `6` |
| `REDIS_URL` | Dirección del servidor de Redis usado como caché. | `redis://localhost:6379` |

El servidor no arranca si falta `MONGO_URI` o si `COMMENT_MAX_AGE_MONTHS` no es un entero positivo.

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor con nodemon (se reinicia al guardar cambios). |
| `npm start` | Inicia el servidor con node. |

## Estructura del proyecto

```
├── assets/               Diagrama del modelo documental
├── postman/              Colección de pruebas
├── src/
│   ├── config/           Conexión a MongoDB
│   ├── controllers/      Lógica de cada endpoint
│   ├── middlewares/      Validaciones (ids, body, nombres repetidos, búsquedas)
│   ├── models/           Schemas de Mongoose
│   ├── routes/           Definición de rutas
│   ├── schemas/          Schemas de Joi
│   ├── swagger/          Documentación OpenAPI (swagger.yaml)
│   └── index.js          Punto de entrada
├── compose.yaml          MongoDB + mongo-express con Docker
└── .env                  Variables de entorno
```

## Endpoints

Los identificadores son `ObjectId` de MongoDB (24 caracteres hexadecimales).

### Usuarios — `/users`

| Método | Ruta | Descripción | Body |
|---|---|---|---|
| GET | `/users` | Lista todos los usuarios | — |
| GET | `/users/:id` | Obtiene un usuario | — |
| POST | `/users` | Crea un usuario | `{ "nickName": "guille" }` |
| PUT | `/users/:id` | Modifica un usuario | `{ "nickName": "guille2" }` |
| DELETE | `/users/:id` | Elimina un usuario, sus posts y los comentarios relacionados | — |

### Seguidores (bonus 2) — `/users`

| Método | Ruta | Descripción | Body |
|---|---|---|---|
| POST | `/users/:id/follow` | `followerId` pasa a seguir al usuario `:id` | `{ "followerId": "<id>" }` |
| DELETE | `/users/:id/unfollow` | `followerId` deja de seguir al usuario `:id` | `{ "followerId": "<id>" }` |
| GET | `/users/:id/followers` | Lista quiénes siguen al usuario | — |
| GET | `/users/:id/following` | Lista a quiénes sigue el usuario | — |

Un usuario no puede seguirse a sí mismo ni seguir dos veces al mismo usuario (responde `400`).

### Tags — `/tags`

| Método | Ruta | Descripción | Body |
|---|---|---|---|
| GET | `/tags` | Lista todos los tags | — |
| GET | `/tags/:id` | Obtiene un tag | — |
| POST | `/tags` | Crea un tag | `{ "name": "deportes" }` |
| PUT | `/tags/:id` | Modifica un tag | `{ "name": "futbol" }` |
| DELETE | `/tags/:id` | Elimina un tag y lo quita de los posts que lo tenían | — |

### Posts — `/posts`

| Método | Ruta | Descripción | Body |
|---|---|---|---|
| GET | `/posts` | Lista todos los posts | — |
| GET | `/posts/:id` | Obtiene un post | — |
| POST | `/posts` | Crea un post | `{ "description": "Mi post", "user": "<id de usuario>" }` |
| PUT | `/posts/:id` | Modifica la descripción de un post | `{ "description": "Nueva descripción" }` |
| DELETE | `/posts/:id` | Elimina un post y sus comentarios | — |
| POST | `/posts/:id/images` | Agrega una imagen a un post | `{ "url": "https://..." }` |
| DELETE | `/posts/:id/images/:imageId` | Quita una imagen de un post | — |
| POST | `/posts/:id/images/upload` | Sube un archivo de imagen al servidor (bonus 1; campo `image`, form-data) | archivo |
| POST | `/posts/:id/tags` | Asocia un tag a un post | `{ "tagId": "<id de tag>" }` |
| DELETE | `/posts/:id/tags/:tagId` | Quita un tag de un post | — |

### Comentarios — `/comments`

| Método | Ruta | Descripción | Body |
|---|---|---|---|
| POST | `/comments` | Crea un comentario | `{ "text": "Hola", "user": "<id de usuario>", "post": "<id de post>" }` |
| GET | `/comments/post/:postId` | Lista los comentarios **visibles** de un post | — |
| PUT | `/comments/:id` | Modifica un comentario | `{ "text": "Texto editado" }` |
| DELETE | `/comments/:id` | Elimina un comentario | — |

## Validaciones y manejo de errores

Las validaciones se hacen en middlewares, antes de llegar al controlador:

- **`validarReferencia`**: comprueba que un id tenga formato de `ObjectId` y que el documento exista. Se usa con los ids de la URL y con los ids que llegan en el body (por ejemplo, `user` y `post` al crear un comentario).
- **`validarSchema`**: valida el body con un schema de Joi.
- **`validarNickName`** y **`validarTagName`**: impiden repetir un `nickName` o el nombre de un tag (al editar, se permite conservar el propio).

Los errores se responden en JSON con un campo `message`:

```json
{ "message": "El nickName guille ya está en uso" }
```

Los errores de Joi agregan el detalle en `error`:

```json
{ "message": "Datos inválidos", "error": "\"nickName\" length must be at least 3 characters long" }
```

| Código | Cuándo |
|---|---|
| `200` | Consulta, modificación o eliminación correcta |
| `201` | Creación correcta |
| `400` | Body inválido, id con formato inválido, `nickName` o tag repetido |
| `404` | El documento (o el referenciado en el body) no existe |
| `500` | Error inesperado del servidor |

## Modelo de datos: embebido vs. referenciado

El diagrama del modelo documental está en [`assets/Diagrama.drawio.html`](./assets/Diagrama.drawio.html).

MongoDB permite guardar datos relacionados de dos formas: **embebidos** (un subdocumento dentro del documento principal) o **referenciados** (guardar el `ObjectId` de un documento de otra colección y traerlo con `populate` cuando hace falta). Elegimos una u otra según cómo se usa cada dato.

### Colecciones

| Colección | Campos principales | Relaciones |
|---|---|---|
| `users` | `nickName` (único) | — |
| `tags` | `name` (único) | — |
| `posts` | `description`, `images[]`, `tags[]`, `user` | `user` → referencia a `users`; `images` → **embebidas**; `tags` → array de referencias a `tags` |
| `comments` | `text`, `user`, `post` | `user` → referencia a `users`; `post` → referencia a `posts` |

### Decisiones

**Imágenes: embebidas en el post.**
Una imagen pertenece a un solo post, no tiene sentido por sí sola y siempre se muestra junto con su post. Un post tiene pocas imágenes, así que no hay riesgo de llegar al límite de 16 MB por documento. Al estar embebidas, se leen en la misma consulta que el post y se borran automáticamente con él.

**Tags: referenciados desde el post.**
La relación es de muchos a muchos: un post tiene varios tags y un tag está en muchos posts. Si los embebiéramos, el mismo tag quedaría copiado en cada post y renombrarlo obligaría a modificar todos. Con referencias, el tag existe una sola vez en su colección y el post guarda solo su `ObjectId`. Como un post tiene pocos tags, el array de ids se mantiene chico.

**Usuario: referenciado desde posts y comentarios.**
El usuario existe por su cuenta, se consulta y se edita independientemente de sus posts. Embeberlo duplicaría sus datos en cada post y comentario, y un cambio de `nickName` habría que repetirlo en todos lados.

**Comentarios: colección propia, referenciando al post y al usuario.**
Los comentarios de un post pueden crecer sin límite, y embebidos podrían superar los 16 MB del documento. Además se crean, editan y borran de forma independiente, y se consultan por post filtrando por antigüedad. Todo eso es más simple en una colección aparte.

### Visibilidad de los comentarios

Un comentario es visible si tiene menos de `COMMENT_MAX_AGE_MONTHS` meses. Esto **no se guarda en la base**: se calcula a partir de `createdAt` con un virtual de Mongoose (`isVisible`), y los comentarios no visibles se filtran al consultarlos.

### Qué pasa al borrar

MongoDB no tiene integridad referencial ni borrado en cascada: si se borra un documento, los que lo referenciaban quedan apuntando a un id que ya no existe. Por eso la aplicación se encarga de mantener la consistencia:

| Se borra | Qué hace la aplicación |
|---|---|
| Un **usuario** | Borra sus posts, los comentarios que escribió y los comentarios que otros dejaron en sus posts. |
| Un **post** | Borra sus comentarios. Sus imágenes se borran con él porque están embebidas. |
| Un **tag** | Lo quita del array `tags` de cada post que lo tenía. Los posts no se borran. |
| Un **comentario** | No afecta a nada más. |
| Una **imagen** | Se quita del array `images` de su post. |

### Cambios respecto del TP1

- Los ids pasaron de enteros autoincrementales a `ObjectId` (24 caracteres hexadecimales).
- El borrado en cascada que antes hacía la base de datos (`onDelete: 'CASCADE'`) ahora lo hace la aplicación.
- La unicidad de `nickName` y del nombre de los tags se define con `unique: true` en los schemas de Mongoose.

## Documentación (Swagger)

Con el servidor levantado, la documentación interactiva está en:

```
http://localhost:3000/api-docs
```

El archivo fuente es `src/swagger/swagger.yaml`.

## Colección de pruebas (Postman)

La colección está en `postman/Unahur Anti-Social Net.postman_collection.json`. Cada pedido tiene un test que verifica el código HTTP esperado, incluyendo casos de error.

1. Importar el archivo en Postman (**Import**).
2. Con el servidor y MongoDB levantados, hacer clic en los `...` de la colección y elegir **Run collection**.
3. Ejecutarla en orden: los primeros pedidos crean los datos (usuarios, post, tag, comentario) que usan los siguientes, y la carpeta **Eliminaciones** los borra al final.

Los nombres de prueba llevan `{{$timestamp}}`, así que la colección se puede correr varias veces sin vaciar la base.

## Bonus 2: seguidores (followers)

### Cómo lo modelamos en MongoDB

Cada usuario guarda un array `following` con los `ObjectId` de los usuarios que sigue:

```js
{
  _id: ObjectId("..."),
  nickName: "guille",
  following: [ObjectId("..."), ObjectId("...")]
}
```

- **A quiénes sigue** un usuario: se lee su array `following` y se completa con `populate`.
- **Quiénes lo siguen**: se buscan los usuarios que tienen su id en el array (`User.find({ following: id })`).

La relación se guarda **de un solo lado** (en el que sigue). Si también guardáramos un array `followers` en el seguido, cada follow obligaría a modificar dos documentos y a mantenerlos sincronizados.

Al borrar un usuario, la aplicación lo quita del array `following` de todos los que lo seguían, porque MongoDB no lo hace solo.

### Comparación con el modelo relacional

En el TP1 (Sequelize) la relación era una **tabla intermedia** `UserFollowers` con dos claves foráneas a `Users` (con dos claves foráneas a Users), definida con `belongsToMany` del modelo consigo mismo.

| | Relacional (TP1) | Documental (TP2) |
|---|---|---|
| Dónde se guarda | Tabla intermedia `UserFollowers`, una fila por cada follow | Array `following` dentro del documento del usuario |
| A quiénes sigue | `JOIN` con la tabla intermedia | Leer el array (`populate` para traer los datos) |
| Quiénes lo siguen | `JOIN` por la otra columna | Consulta `find({ following: id })` |
| Evitar duplicados | Clave primaria compuesta en la tabla intermedia | Lo controla la aplicación antes de agregar |
| Al borrar un usuario | `ON DELETE CASCADE` borra sus filas automáticamente | La aplicación lo quita de los arrays |

**Límite de esta solución:** si un usuario siguiera a muchísimas personas, el array podría crecer hasta acercarse al límite de 16 MB por documento. Para una red social real con ese volumen, convendría una colección aparte `follows` con un documento por relación (`{ follower, following }`), que es lo más parecido a la tabla intermedia del modelo relacional.

## Bonus 3: caché de posts con Redis

La información de los posts cambia poco, pero `GET /posts` es una consulta pesada: trae todos los posts, completa sus tags y busca los comentarios visibles de cada uno. Para no repetirla en cada pedido, guardamos el resultado en **Redis**, una base de datos clave-valor que trabaja en memoria y responde mucho más rápido que MongoDB.

### Cómo funciona

1. Al recibir `GET /posts`, se busca la clave `posts` en Redis.
2. Si existe, se responde directamente con ese valor, sin consultar MongoDB.
3. Si no existe, se consulta MongoDB, se responde y se guarda el resultado en Redis con un vencimiento de **60 segundos** (`EX: 60`).

### Cómo se mantiene actualizada

Si un post cambia, la caché podría mostrar datos viejos. Para evitarlo, el middleware `invalidarCachePosts` borra la clave `posts` en cualquier pedido que modifique datos (`POST`, `PUT` o `DELETE`), en cualquier ruta. Se borra ante cualquier cambio y no solo en `/posts` porque el listado de posts incluye información de otras entidades: los nombres de los tags, los comentarios y el `nickName` de quien comentó.

El vencimiento de 60 segundos funciona como respaldo: aunque algo no se invalide, el dato viejo dura como máximo un minuto.

### Cómo comprobarlo

Después de un `GET /posts`, se puede ver cuánto le queda a la caché:

```bash
docker compose exec redis redis-cli TTL posts
```

Devuelve los segundos restantes, o `-2` si la clave no existe (por ejemplo, después de crear o modificar algo).