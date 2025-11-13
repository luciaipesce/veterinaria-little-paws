const URL = "http://localhost:3000/mascotas";
const URL_CLIENTES = "http://localhost:3000/clientes";

// Popup kawaii
function mostrarPopup(mensaje) {
    const popup = document.getElementById("popup");
    const msg = document.getElementById("popup-msg");

    msg.innerHTML = mensaje;
    popup.classList.remove("hidden");

    setTimeout(() => {
        popup.classList.add("hidden");
    }, 2000);
}

// Cargar dueños en el select
async function cargarClientes() {
    try {
        const res = await fetch(URL_CLIENTES);
        const clientes = await res.json();

        const select = document.getElementById("dniCliente");
        select.innerHTML = "";

        clientes.forEach(c => {
            const opt = document.createElement("option");
            opt.value = c.DNI;                         // valor = DNI
            opt.textContent = `${c.DNI} - ${c.Nombre}`;
            select.appendChild(opt);
        });

    } catch (err) {
        console.error("No se pudieron cargar los clientes", err);
    }
}

// Guardar mascota
document.getElementById("formMascota").addEventListener("submit", async (e) => {
    e.preventDefault();

    const pesoValor = document.getElementById("peso").value;

    const mascota = {
        // ID no hace falta mandarlo, lo genera SQL
        Nombre: document.getElementById("nombre").value,
        Especie: document.getElementById("especie").value,
        Raza: document.getElementById("raza").value,
        Peso: pesoValor ? parseFloat(pesoValor) : null,
        FechaNacimiento: document.getElementById("fechaNacimiento").value,
        dniDueno: parseInt(document.getElementById("dniCliente").value, 10)  // 👈 NOMBRE CORRECTO
    };

    try {
        const res = await fetch(URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(mascota)
        });

        // por si algo falla en el server
        if (!res.ok) {
            const texto = await res.text();
            console.error("Error al guardar mascota:", texto);
            mostrarPopup("⚠️ Error guardando mascota");
            return;
        }

        mostrarPopup("💖 Mascota Agregada con Éxito");

        setTimeout(() => {
            window.location.href = "mascotas.html";
        }, 1500);

    } catch (err) {
        console.error("Error de red:", err);
        mostrarPopup("⚠️ Error guardando mascota");
    }
});

// Ejecutar al cargar
cargarClientes();
