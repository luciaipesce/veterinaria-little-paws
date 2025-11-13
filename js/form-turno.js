const URL_TURNOS = "http://localhost:3000/turnos";
const URL_MASCOTAS = "http://localhost:3000/mascotas";

let mascotas = [];

// POPUP
function mostrarPopup(mensaje) {
    const popup = document.getElementById("popup");
    const msg = document.getElementById("popup-msg");

    msg.innerHTML = mensaje;
    popup.classList.remove("hidden");

    setTimeout(() => popup.classList.add("hidden"), 2000);
}

// CARGAR MASCOTAS
async function cargarMascotas() {
    const res = await fetch(URL_MASCOTAS);
    mascotas = await res.json();

    const select = document.getElementById("idMascota");
    select.innerHTML = "";

    mascotas.forEach(m => {
        const opt = document.createElement("option");
        opt.value = m.ID;
        opt.textContent = `${m.ID} - ${m.Nombre}`;
        select.appendChild(opt);
    });

    actualizarCliente();
}

// AUTOCOMPLETAR CLIENTE
function actualizarCliente() {
    const id = parseInt(document.getElementById("idMascota").value);
    const mascota = mascotas.find(m => m.ID === id);

    if (mascota) {
        document.getElementById("cliente").value =
            `${mascota.DNI_Cliente} - ${mascota.NombreCliente}`;
    }
}

document.getElementById("idMascota")
        .addEventListener("change", actualizarCliente);

// GUARDAR TURNO
document.getElementById("formTurno").addEventListener("submit", async (e) => {
    e.preventDefault();

    const fecha = document.getElementById("fecha").value;
    let hora = document.getElementById("hora").value.trim();
    const idMascota = parseInt(document.getElementById("idMascota").value);
    const mascota = mascotas.find(m => m.ID === idMascota);

    if (!fecha) { mostrarPopup("⚠️ Ingresa una fecha"); return; }
    if (!hora) { mostrarPopup("⚠️ Ingresa una hora"); return; }
    if (!mascota) { mostrarPopup("⚠️ Mascota inválida"); return; }

    const turno = {
        Fecha: fecha,
        Hora: hora, // 👈 AHORA ES TEXTO PLANO
        Motivo: document.getElementById("motivo").value,
        ID_Mascota: idMascota,
        DNI_Cliente: mascota.DNI_Cliente
    };

    console.log("Enviando turno al backend:", turno);

    const res = await fetch(URL_TURNOS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(turno)
    });

    if (!res.ok) {
        mostrarPopup("⚠️ Error guardando turno");
        return;
    }

    mostrarPopup("💗 Turno Registrado con Éxito");
    setTimeout(() => window.location.href = "turnos.html", 1500);
});

cargarMascotas();
