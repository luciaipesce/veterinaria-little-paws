// js/turnos.js
const URL_TURNOS = "http://localhost:3000/turnos";

let turnosGlobal = [];   // acá guardamos todos los turnos que vienen del backend

/* ------------------------------
   Helpers de fecha (SIN TZ raro)
------------------------------ */

// t.Fecha viene como "2025-11-13T00:00:00.000Z" o como "2025-11-13"
function parseFecha(fechaSQL) {
    if (!fechaSQL) return null;

    const iso = fechaSQL.toString();          // por las dudas
    const soloFecha = iso.split("T")[0];      // "2025-11-13"
    const [anio, mes, dia] = soloFecha.split("-").map(Number);

    // Creamos la fecha en horario local, sin conversión de huso horario
    return new Date(anio, mes - 1, dia);
}

function formatearFecha(fechaSQL) {
    if (!fechaSQL) return "-";

    const f = parseFecha(fechaSQL);
    if (!f) return "-";

    const dia  = String(f.getDate()).padStart(2, "0");
    const mes  = String(f.getMonth() + 1).padStart(2, "0");
    const anio = f.getFullYear();

    return `${dia}/${mes}/${anio}`;
}

/* ------------------------------
   Popup kawaii
------------------------------ */
function mostrarPopup(mensaje) {
    const popup = document.getElementById("popup");
    const msg = document.getElementById("popup-msg");

    msg.innerHTML = mensaje;
    popup.classList.remove("hidden");

    setTimeout(() => popup.classList.add("hidden"), 2000);
}

/* ------------------------------
   Renderizar tabla
------------------------------ */
function renderTabla(turnos) {
    const tabla = document.getElementById("tablaTurnos");
    tabla.innerHTML = "";

    turnos.forEach(t => {
        const horaBonita = t.Hora ? t.Hora.toString().substring(0, 5) : "-";

        tabla.innerHTML += `
            <tr>
                <td>${t.ID}</td>
                <td>${formatearFecha(t.Fecha)}</td>
                <td>${horaBonita}</td>
                <td>${t.NombreMascota}</td>
                <td>${t.NombreCliente}</td>
                <td>${t.Motivo}</td>
                <td>
                    <button class="btn-eliminar" onclick="eliminarTurno(${t.ID})">
                        ❌
                    </button>
                </td>
            </tr>
        `;
    });
}

/* ------------------------------
   Cargar TODOS los turnos
------------------------------ */
async function cargarTurnos() {
    try {
        const res = await fetch(URL_TURNOS);
        if (!res.ok) {
            console.error("Error al traer turnos:", await res.text());
            return;
        }

        turnosGlobal = await res.json();   // guardamos copia global
        renderTabla(turnosGlobal);         // mostramos todos

    } catch (err) {
        console.error("⚠️ Error Cargando Turnos:", err);
    }
}

/* ------------------------------
   Eliminar turno
------------------------------ */
async function eliminarTurno(id) {
    try {
        const res = await fetch(`${URL_TURNOS}/${id}`, { method: "DELETE" });

        if (!res.ok) {
            mostrarPopup("⚠️ No se pudo eliminar el turno");
            return;
        }

        mostrarPopup("💗 Turno eliminado con éxito");

        // Sacamos el turno del array y volvemos a aplicar el filtro actual
        turnosGlobal = turnosGlobal.filter(t => t.ID !== id);
        aplicarFiltroTurnos(filtroActual);

    } catch (err) {
        console.error("Error eliminando turno:", err);
        mostrarPopup("⚠️ Error de conexión");
    }
}

/* ------------------------------
   Botón crear turno
------------------------------ */
document.getElementById("btnNuevoTurno").addEventListener("click", () => {
    window.location.href = "form-turno.html";
});

/* ------------------------------
   Filtros: hoy / semana / mes / todos
------------------------------ */
let filtroActual = "todos";   // para saber qué filtro está activo

document.querySelectorAll(".filtro-btn").forEach(btn => {
    btn.addEventListener("click", e => {
        document
            .querySelectorAll(".filtro-btn")
            .forEach(b => b.classList.remove("active"));

        e.target.classList.add("active");
        filtroActual = e.target.dataset.filtro;

        aplicarFiltroTurnos(filtroActual);
    });
});

function aplicarFiltroTurnos(filtro) {
    if (!turnosGlobal.length) {
        renderTabla([]);  // por las dudas
        return;
    }

    const hoy = new Date();
    const hoySinHora = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

    let filtrados = [...turnosGlobal];

    if (filtro === "hoy") {
        filtrados = turnosGlobal.filter(t => {
            const f = parseFecha(t.Fecha);
            if (!f) return false;
            const fSinHora = new Date(f.getFullYear(), f.getMonth(), f.getDate());
            return fSinHora.getTime() === hoySinHora.getTime();
        });
    } else if (filtro === "semana") {
    // SEMANA REAL: lunes → viernes de la semana actual
    const diaSemana = hoySinHora.getDay(); // 0=domingo, 1=lunes, ..., 6=sábado

    // calcular lunes
    const lunes = new Date(hoySinHora);
    lunes.setDate(hoySinHora.getDate() - ((diaSemana + 6) % 7));

    // calcular viernes (lunes + 4 días)
    const viernes = new Date(lunes);
    viernes.setDate(lunes.getDate() + 4);

    filtrados = turnosGlobal.filter(t => {
        const f = parseFecha(t.Fecha);
        if (!f) return false;

        const fSinHora = new Date(f.getFullYear(), f.getMonth(), f.getDate());
        return fSinHora >= lunes && fSinHora <= viernes;
    });

    } else if (filtro === "mes") {
        const mes = hoy.getMonth();
        const anio = hoy.getFullYear();

        filtrados = turnosGlobal.filter(t => {
            const f = parseFecha(t.Fecha);
            if (!f) return false;
            return f.getMonth() === mes && f.getFullYear() === anio;
        });
    }
    // si es "todos" no tocamos filtrados

    renderTabla(filtrados);
}

/* ------------------------------
    Ejecutar al cargar
------------------------------ */
cargarTurnos();

