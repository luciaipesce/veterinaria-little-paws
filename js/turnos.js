const URL_TURNOS = "http://localhost:3000/turnos";

const msgTurno = localStorage.getItem("msgTurno");
if (msgTurno) {
    const div = document.getElementById("msg");
    div.textContent = msgTurno;
    div.style.display = "block";

    localStorage.removeItem("msgTurno");

    setTimeout(() => {
        div.style.display = "none";
    }, 3000);
}

function mostrarPopup(mensaje) {
    const popup = document.getElementById("popup");
    const msg = document.getElementById("popup-msg");

    msg.innerHTML = mensaje;
    popup.classList.remove("hidden");

    setTimeout(() => {
        popup.classList.add("hidden");
    }, 2000);
}

async function cargarTurnos() {
    try {
        const res = await fetch(URL_TURNOS);
        const data = await res.json();

        const tabla = document.getElementById("tablaTurnos");
        tabla.innerHTML = "";

        data.forEach(t => {
            tabla.innerHTML += `
                <tr>
                    <td>${t.IdTurno}</td>
                    <td>${t.Fecha ? new Date(t.Fecha).toLocaleDateString() : "-"}</td>
                    <td>${t.Hora || "-"}</td>
                    <td>${t.Mascota || "-"}</td>
                    <td>${t.Cliente || "-"}</td>
                    <td>${t.Motivo || "-"}</td>
                    <td>
                        <button class="btn-eliminar" onclick="eliminarTurno(${t.IdTurno})">
                            ❌
                        </button>
                    </td>
                </tr>
            `;
        });
    } catch (err) {
        console.warn("⚠️ No se pudo conectar al backend, usando localStorage…", err);

        const lista = JSON.parse(localStorage.getItem("turnos")) || [];
        const tabla = document.getElementById("tablaTurnos");
        tabla.innerHTML = "";

        lista.forEach(t => {
            tabla.innerHTML += `
                <tr>
                    <td>${t.id}</td>
                    <td>${t.Fecha || "-"}</td>
                    <td>${t.Hora || "-"}</td>
                    <td>${t.Mascota || "-"}</td>
                    <td>${t.Cliente || "-"}</td>
                    <td>${t.Motivo || "-"}</td>
                    <td>
                        <button class="btn-eliminar" onclick="eliminarTurnoLocal(${t.id})">
                            ❌
                        </button>
                    </td>
                </tr>
            `;
        });
    }
}

document.getElementById("btnNuevoTurno").addEventListener("click", () => {
    window.location.href = "form-turno.html";
});

async function eliminarTurno(id) {
    try {
        const res = await fetch(`${URL_TURNOS}/${id}`, { method: "DELETE" });

        if (!res.ok) {
            mostrarPopup("⚠️ No se pudo eliminar el turno");
            return;
        }

        mostrarPopup("💗 Turno eliminado con éxito");

        setTimeout(() => {
            cargarTurnos();
        }, 1200);

    } catch (err) {
        console.warn("Sin conexión con el backend, borrando localmente…", err);
        eliminarTurnoLocal(id);
    }
}

function eliminarTurnoLocal(id) {
    let lista = JSON.parse(localStorage.getItem("turnos")) || [];
    lista = lista.filter(t => t.id != id);
    localStorage.setItem("turnos", JSON.stringify(lista));

    mostrarPopup("💗 Turno eliminado localmente");

    setTimeout(() => {
        cargarTurnos();
    }, 1200);
}

cargarTurnos();
