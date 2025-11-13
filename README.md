🐾 Veterinaria Little Paws – Sistema de Gestión de Turnos

Bienvenidos al proyecto Veterinaria Little Paws, un sistema web para administrar clientes, mascotas y turnos veterinarios.
Incluye alta, baja, modificación y filtros de turnos por fecha (hoy, semana y mes), con diseño kawaii y responsive.

✨ Tecnologías utilizadas
🔹 Frontend

HTML5

CSS3 (estilo personalizado kawaii pastel)

JavaScript Vanilla

Fetch API

🔹 Backend

Node.js

Express.js

SQL Server (Base de Datos)

mssql driver

🗂️ Estructura del proyecto
veterinaria-little-paws/
│
├── backend/
│   ├── server.js
│   └── ...
│
├── frontend/
│   ├── index.html
│   ├── turnos.html
│   ├── form-turno.html
│   ├── css/
│   ├── js/
│   └── assets/
│
└── README.md

🐶 Funcionalidades
✅ Clientes

Alta de clientes

Listado de clientes

Eliminación de clientes

✅ Mascotas

Alta de mascotas vinculadas a cliente

Listado

Eliminación

🗓️ Turnos

Alta de turnos (fecha, hora, mascota, cliente y motivo)

Listado general

Eliminación

Filtros inteligentes:

Hoy

Semana (Lunes → Viernes)

Mes actual

Ordenados por fecha ascendente en los filtros

Corrección automática de zona horaria para evitar corrimientos

🔧 Configuración de SQL Server

Tablas utilizadas:

📌 Clientes
DNI (int, PK)
Nombre (nvarchar)
Domicilio (nvarchar)
Telefono (nvarchar)
Email (nvarchar)

📌 Mascotas
ID (int, PK)
Nombre (nvarchar)
Especie (nvarchar)
Raza (nvarchar)
Peso (decimal)
FechaNacimiento (date)
DNI_Cliente (int, FK)

📌 Turnos
ID (int, PK)
Fecha (date)
Hora (nvarchar)
Motivo (nvarchar)
ID_Mascota (int, FK)
DNI_Cliente (int, FK)

🚀 Cómo ejecutar el proyecto
1️⃣ Instalar dependencias
cd backend
npm install

2️⃣ Iniciar servidor
node server.js


El backend queda corriendo en:

http://localhost:3000

3️⃣ Abrir frontend

Simplemente abrir index.html en el navegador.

🎨 Diseño

El proyecto utiliza un estilo kawaii pastel inspirado en Little Paws, con:

colores suaves

botones redondeados

emojis

tipografía amigable

👩‍💻 Autora

Lucía Pesce
Desarrollado para la materia Bases de Datos – UTN 2025.
