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
  server: "KASTUX",       
  database: "veterinaria-little-paws",
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

// PROBAR CONEXIÓN AL INICIO
sql.connect(dbConfig)
  .then(() => console.log("✅ Conectado a SQL Server con usuario SQL"))
  .catch(err => console.log("❌ Error de conexión:", err));

// GET CLIENTES
app.get("/clientes", async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query("SELECT * FROM Clientes");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
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
        INSERT INTO Clientes (DNI, Nombre, Domicilio, Telefono, Email)
        VALUES (@DNI, @Nombre, @Domicilio, @Telefono, @Email)
      `);

    res.json({ mensaje: "💖 Cliente agregado correctamente" });

  } catch (err) {
    res.status(500).send(err.message);
  }
});

// DELETE
app.delete("/clientes/:dni", async (req, res) => {
  const { dni } = req.params;

  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input("DNI", sql.Int, dni)
      .query("DELETE FROM Clientes WHERE DNI = @DNI");

    res.json({ mensaje: "Cliente eliminado correctamente 💀" });

  } catch (err) {
    res.status(500).send(err.message);
  }
});

// SERVER
app.listen(3000, () =>
  console.log("🚀 Servidor corriendo en http://localhost:3000")
);
