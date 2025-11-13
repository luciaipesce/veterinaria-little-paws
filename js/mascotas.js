const URL_MASCOTAS = "http://localhost:3000/mascotas";

// mensaje de éxito (si viniera de otra pantalla)
const msgMascota = localStorage.getItem("msgMascota");
if (msgMascota) {
    const div = document.getElementById("msg");
    div.textContent = msgMascota;
    div.style.display = "block";

    localStorage.removeItem("msgMascota");

    setTimeout(() => {
        div.style.display = "none";
    }, 3000);
}

// popup kawaii compartido
function mostrarPopup(mensaje) {
    const popup = document.getElementById("popup");
    const msg = document.getElementById("popup-msg");

    msg.innerHTML = mensaje;
    popup.classList.remove("hidden");

    setTimeout(() => {
        popup.classList.add("hidden");
    }, 2000);
}

// cargar mascotas
async function cargarMascotas() {
    try {
        const res = await fetch(URL_MASCOTAS);
        const data = await res.json();

        const tabla = document.getElementById("tablaMascotas");
        tabla.innerHTML = "";

        data.forEach(m => {
            tabla.innerHTML += `
                <tr>
                    <td>${m.ID}</td>
                    <td>${m.Nombre}</td>
                    <td>${m.Especie || "-"}</td>
                    <td>${m.Raza || "-"}</td>
                    <td>${m.Peso ?? "-"}</td>
                    <td>${m.FechaNacimiento ? new Date(m.FechaNacimiento).toLocaleDateString() : "-"}</td>
                    <td>
                        <button class="btn-eliminar" onclick="eliminarMascota(${m.ID})">
                            ❌
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (err) {
        console.warn("⚠️ No se pudo conectar al backend, usando localStorage…", err);

        const lista = JSON.parse(localStorage.getItem("mascotas")) || [];
        const tabla = document.getElementById("tablaMascotas");
        tabla.innerHTML = "";

        lista.forEach(m => {
        tabla.innerHTML += `
            <tr>
                <td>${m.ID}</td>
                <td>${m.Nombre}</td>
                <td>${m.Especie}</td>
                <td>${m.Raza}</td>
                <td>${m.Peso}</td>
                <td>${m.FechaNacimiento}</td>
                <td>
                    <button class="btn-eliminar" onclick="eliminarMascota(${m.ID})">❌</button>
                </td>
            </tr>
        `;
        });
    }
}

// botón nueva mascota
document.getElementById("btnNuevaMascota").addEventListener("click", () => {
    window.location.href = "form-mascota.html";
});

// eliminar mascota (backend)
async function eliminarMascota(id) {
    try {
        const res = await fetch(`${URL_MASCOTAS}/${id}`, { method: "DELETE" });

        if (!res.ok) {
            mostrarPopup("⚠️ No se pudo Eliminar la Mascota");
            return;
        }

        mostrarPopup("💗 Mascota Eliminada con Éxito");

        setTimeout(() => {
            cargarMascotas();
        }, 1200);

    } catch (err) {
        console.warn("Sin conexión con el backend, borrando localmente…", err);
        eliminarMascotaLocal(id);
    }
}

// eliminar en localStorage si no hay server
function eliminarMascotaLocal(id) {
    let lista = JSON.parse(localStorage.getItem("mascotas")) || [];
    lista = lista.filter(m => m.ID != id);
    localStorage.setItem("mascotas", JSON.stringify(lista));

    mostrarPopup("💗 Mascota Eliminada Localmente");

    setTimeout(() => {
        cargarMascotas();
    }, 1200);
}

// cargar al iniciar
cargarMascotas();
