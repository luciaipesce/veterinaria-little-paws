const URL_TURNOS = "http://localhost:3000/turnos";

// Popup kawaii
function mostrarPopup(mensaje) {
    const popup = document.getElementById("popup");
    const msg = document.getElementById("popup-msg");

    msg.innerHTML = mensaje;
    popup.classList.remove("hidden");

    setTimeout(() => popup.classList.add("hidden"), 2000);
}

// Cargar lista de turnos
async function cargarTurnos() {
    try {
        const res = await fetch(URL_TURNOS);
        if (!res.ok) {
            console.error("Error al traer turnos:", await res.text());
            return;
        }

        const turnos = await res.json();

        const tabla = document.getElementById("tablaTurnos");
        tabla.innerHTML = "";

        turnos.forEach(t => {
            // t.Hora suele venir como "03:48:00", dejo solo HH:MM
            const horaBonita = t.Hora ? t.Hora.toString().substring(0,5) : "-";

            tabla.innerHTML += `
                <tr>
                    <td>${t.ID}</td>
                    <td>${t.Fecha ? new Date(t.Fecha).toLocaleDateString() : "-"}</td>
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

    } catch (err) {
        console.error("⚠️ Error Cargando Turnos:", err);
    }
}

// Botón crear turno
document.getElementById("btnNuevoTurno").addEventListener("click", () => {
    window.location.href = "form-turno.html";
});

// Eliminar turno
async function eliminarTurno(id) {
    try {
        const res = await fetch(`${URL_TURNOS}/${id}`, { method: "DELETE" });

        if (!res.ok) {
            mostrarPopup("⚠️ No se pudo Eliminar el Turno");
            return;
        }

        mostrarPopup("💗 Turno Eliminado con Éxito");
        setTimeout(cargarTurnos, 1200);

    } catch (err) {
        console.error("Error Eliminando Turno:", err);
        mostrarPopup("⚠️ Error de Conexión");
    }
}

// Ejecutar al cargar
cargarTurnos();
