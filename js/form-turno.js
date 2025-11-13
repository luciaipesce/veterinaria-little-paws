const URL_TURNOS = "http://localhost:3000/turnos";

function mostrarPopup(mensaje) {
    const popup = document.getElementById("popup");
    const msg = document.getElementById("popup-msg");

    msg.innerHTML = mensaje;
    popup.classList.remove("hidden");

    setTimeout(() => {
        popup.classList.add("hidden");
    }, 2000);
}

document.getElementById("formTurno").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nuevoTurno = {
        Fecha: document.getElementById("fecha").value,
        Hora: document.getElementById("hora").value,
        Mascota: document.getElementById("mascota").value,
        Cliente: document.getElementById("cliente").value,
        Motivo: document.getElementById("motivo").value,
    };

    try {
        await fetch(URL_TURNOS, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoTurno),
        });

        mostrarPopup("💖 Turno agregado con éxito");

        setTimeout(() => {
            window.location.href = "turnos.html";
        }, 1500);

    } catch (err) {
        console.warn("Sin backend, guardando turno en localStorage…", err);

        const lista = JSON.parse(localStorage.getItem("turnos")) || [];
        const nuevoId = lista.length ? lista[lista.length - 1].id + 1 : 1;

        lista.push({ id: nuevoId, ...nuevoTurno });
        localStorage.setItem("turnos", JSON.stringify(lista));

        mostrarPopup("💖 Turno guardado localmente");

        setTimeout(() => {
            window.location.href = "turnos.html";
        }, 1500);
    }
});
