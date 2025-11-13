const express = require("express");
const sql = require("mssql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// CONFIG SQL LOGIN (NO Windows)
const dbConfig = {
  user: "vet_admin",
  password: "12345",
  server: "KASTUX",  // CAMBIAR si tu servidor tiene otro nombre
  database: "veterinaria-little-paws",
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

// PROBAR CONEXIÓN
sql.connect(dbConfig)
  .then(() => console.log("✅ Conectado a SQL Server"))
  .catch(err => console.log("❌ Error de conexión:", err));

/* =====================================================
                CLIENTES
=====================================================*/

// GET CLIENTES
app.get("/clientes", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query("SELECT * FROM Clientes");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(JSON.stringify(err));
  }
});

// POST CLIENTE
app.post("/clientes", async (req, res) => {
  const { DNI, Nombre, Domicilio, Telefono, Email } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input("DNI", sql.Int, DNI)
      .input("Nombre", sql.NVarChar(100), Nombre)
      .input("Domicilio", sql.NVarChar(200), Domicilio)
      .input("Telefono", sql.NVarChar(50), Telefono)
      .input("Email", sql.NVarChar(100), Email)
      .query(`
        INSERT INTO
        Clientes (DNI, Nombre, Domicilio, Telefono, Email)
        VALUES (@DNI, @Nombre, @Domicilio, @Telefono, @Email)
      `);

    res.json({ mensaje: "Cliente agregado con éxito" });
  } catch (err) {
    res.status(500).send(JSON.stringify(err));
  }
});

// DELETE CLIENTE
app.delete("/clientes/:dni", async (req, res) => {
  const { dni } = req.params;

  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input("DNI", sql.Int, dni)
      .query("DELETE FROM Clientes WHERE DNI = @DNI");

    res.json({ mensaje: "Cliente eliminado" });
  } catch (err) {
    res.status(500).send(JSON.stringify(err));
  }
});


/* =====================================================
                MASCOTAS
=====================================================*/

// GET MASCOTAS
app.get("/mascotas", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query(`
        SELECT M.ID, M.Nombre, M.Especie, M.Raza, M.Peso, M.FechaNacimiento,
        M.DNI_Cliente, C.Nombre AS NombreCliente
        FROM Mascotas M
        JOIN Clientes C ON C.DNI = M.DNI_Cliente
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(JSON.stringify(err));
  }
});

// POST MASCOTA
app.post("/mascotas", async (req, res) => {
  const { Nombre, Especie, Raza, Peso, FechaNacimiento, dniDueno } = req.body;

  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input("Nombre", sql.NVarChar(100), Nombre)
      .input("Especie", sql.NVarChar(50), Especie)
      .input("Raza", sql.NVarChar(100), Raza)
      .input("Peso", sql.Decimal(5,2), Peso || null)
      .input("FechaNacimiento", sql.Date, FechaNacimiento || null)
      .input("DNI_Cliente", sql.Int, dniDueno)   // 👈 ESTE CAMBIO ES EL CLAVE 💖
      .query(`
        INSERT INTO Mascotas
        (Nombre, Especie, Raza, Peso, FechaNacimiento, DNI_Cliente)
        VALUES (@Nombre, @Especie, @Raza, @Peso, @FechaNacimiento, @DNI_Cliente)
      `);

    res.json({ mensaje: "Mascota agregada con éxito" });

  } catch (err) {
    console.error("🔥 ERROR SQL:", err.message);
    res.status(500).send(JSON.stringify(err));
  }
});


// DELETE MASCOTA
app.delete("/mascotas/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input("ID", sql.Int, id)
      .query("DELETE FROM Mascotas WHERE ID = @ID");

    res.json({ mensaje: "Mascota eliminada" });

  } catch (err) {
    res.status(500).send(JSON.stringify(err));
  }
});

/* =====================================================
                    TURNOS
=====================================================*/

// GET TURNOS
app.get("/turnos", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);

    const result = await pool.request().query(`
      SELECT 
        T.ID,
        T.Fecha,
        T.Hora,
        T.Motivo,
        M.ID AS ID_Mascota,
        M.Nombre AS NombreMascota,
        C.DNI AS DNI_Cliente,
        C.Nombre AS NombreCliente
      FROM Turnos T
      JOIN Mascotas M ON M.ID = T.ID_Mascota
      JOIN Clientes C ON C.DNI = T.DNI_Cliente
    `);

    res.json(result.recordset);

  } catch (err) {
    res.status(500).send(JSON.stringify(err));
  }
});

// POST TURNO
app.post("/turnos", async (req, res) => {
  const { Fecha, Hora, Motivo, ID_Mascota, DNI_Cliente } = req.body;

  console.log("📥 Datos recibidos en backend:", req.body);

  try {
    const pool = await sql.connect(dbConfig);

    console.log("⚡ Ejecutando SQL con datos:");
    console.log("Fecha:", Fecha);
    console.log("Hora:", Hora);
    console.log("Motivo:", Motivo);
    console.log("ID_Mascota:", ID_Mascota);
    console.log("DNI_Cliente:", DNI_Cliente);

    await pool.request()
      .input("Fecha", sql.Date, Fecha)
      .input("Hora", sql.NVarChar(20), Hora)  
      .input("Motivo", sql.NVarChar(200), Motivo)
      .input("ID_Mascota", sql.Int, ID_Mascota)
      .input("DNI_Cliente", sql.Int, DNI_Cliente)
      .query(`
        INSERT INTO Turnos (Fecha, Hora, Motivo, ID_Mascota, DNI_Cliente)
        VALUES (@Fecha, @Hora, @Motivo, @ID_Mascota, @DNI_Cliente)
      `);

    res.json({ mensaje: "Turno registrado con éxito" });

  } catch (err) {
    console.error("🔥 ERROR SQL COMPLETO:", err);   // 👈 MOSTRAR ERROR REAL
    res.status(500).send(JSON.stringify(err));      // 👈 ENVIAR ERROR REAL
  }
});


// DELETE TURNO
app.delete("/turnos/:id", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);

    await pool.request()
      .input("ID", sql.Int, req.params.id)
      .query("DELETE FROM Turnos WHERE ID = @ID");

    res.json({ mensaje: "Turno eliminado" });

  } catch (err) {
    res.status(500).send(JSON.stringify(err));
  }
});

/* =====================================================
                SERVER
=====================================================*/

app.listen(3000, () => {
  console.log("🚀 Servidor corriendo en http://localhost:3000");
});
