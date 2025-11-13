const URL = "http://localhost:3000/clientes";

// Función popup kawaii (la misma que usás en clientes.js)
function mostrarPopup(mensaje) {
    const popup = document.getElementById("popup");
    const msg = document.getElementById("popup-msg");

    msg.innerHTML = mensaje;
    popup.classList.remove("hidden");

    // ocultarlo después de 2 segundos
    setTimeout(() => {
        popup.classList.add("hidden");
    }, 2000);
}

document.getElementById("formCliente").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nuevoCliente = {
        DNI: document.getElementById("dni").value,
        Nombre: document.getElementById("nombre").value,
        Domicilio: document.getElementById("domicilio").value,
        Telefono: document.getElementById("telefono").value,
        Email: document.getElementById("email").value,
    };

    try {
        await fetch(URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoCliente),
        });

        // 🩷 mostrar popup kawaii
        mostrarPopup("💖 Cliente Agregado con Éxito");

        // esperar a que se vea el popup
        setTimeout(() => {
            window.location.href = "clientes.html";
        }, 1500);

    } catch {
        // fallback offline
        const lista = JSON.parse(localStorage.getItem("clientes")) || [];
        lista.push(nuevoCliente);
        localStorage.setItem("clientes", JSON.stringify(lista));

        mostrarPopup("💖 Cliente Guardado Localmente");

        setTimeout(() => {
            window.location.href = "clientes.html";
        }, 1500);
    }
});