const URL = "http://localhost:3000/clientes";

const msg = localStorage.getItem("msgCliente");
if (msg) {
    const div = document.getElementById("msg");
    div.textContent = msg;
    div.style.display = "block";

    // borrar mensaje después de mostrarlo
    localStorage.removeItem("msgCliente");

    // ocultarlo después de 3 segundos
    setTimeout(() => {
        div.style.display = "none";
    }, 3000);
}

// 📋 Mostrar todos los clientes
async function cargarClientes() {
  try {
      const res = await fetch(URL);
      const data = await res.json();

      const tabla = document.getElementById("tablaClientes");
      tabla.innerHTML = "";

    data.forEach(c => {
      tabla.innerHTML += `
        <tr>
          <td>${c.DNI}</td>
          <td>${c.Nombre}</td>
          <td>${c.Domicilio || "-"}</td>
          <td>${c.Telefono || "-"}</td>
          <td>${c.Email || "-"}</td>
          <td>
            <button class="btn-eliminar" onclick="eliminarCliente(${c.DNI})">
                ❌
            </button>
          </td>
        </tr>
      `;
    });
  } catch (err) {
      console.log("⚠️ No se pudo conectar al backend, usando localStorage…");

      const lista = JSON.parse(localStorage.getItem("clientes")) || [];
      const tabla = document.getElementById("tablaClientes");
      tabla.innerHTML = "";

      lista.forEach(c => {
        tabla.innerHTML += `
          <tr>
            <td>${c.DNI}</td>
            <td>${c.Nombre}</td>
            <td>${c.Domicilio || "-"}</td>
            <td>${c.Telefono || "-"}</td>
            <td>${c.Email || "-"}</td>
          </tr>
        `;
      });
  }
}

// 👉 Botón que abre el formulario
document.getElementById("btnNuevoCliente").addEventListener("click", () => {
    window.location.href = "form-cliente.html";
});

// 🎀 Popup kawaii
function mostrarPopup(mensaje) {
    const popup = document.getElementById("popup");
    const msg = document.getElementById("popup-msg");

    msg.innerHTML = mensaje;
    popup.classList.remove("hidden");

    setTimeout(() => {
        popup.classList.add("hidden");
    }, 2000);
}

// Cargar al iniciar
cargarClientes();

async function eliminarCliente(dni) {

  try {
    const res = await fetch(`${URL}/${dni}`, { method: "DELETE" });

    if (!res.ok) {
      mostrarPopup("⚠️ No se pudo eliminar el cliente");
      return;
    }

    mostrarPopup("💗 Cliente Eliminado con Éxito");

    // Pequeña pausa para que se vea el popup
    setTimeout(() => {
      cargarClientes();
    }, 1200);

  } catch (err) {
    // Fallback localStorage si no hay backend
    console.warn("Sin conexión con el backend, borrando localmente…", err);

    let lista = JSON.parse(localStorage.getItem("clientes")) || [];
    lista = lista.filter(c => c.DNI != dni);
    localStorage.setItem("clientes", JSON.stringify(lista));

    mostrarPopup("💗 Cliente Eliminado Localmente");

    setTimeout(() => {
      cargarClientes();
    }, 1200);
  }
}