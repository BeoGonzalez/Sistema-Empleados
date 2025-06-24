window.addEventListener('DOMContentLoaded', async () => {
  // Configuración de Supabase
  const supabaseUrl = 'https://bsrrdsudwfrctzmidlxd.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzcnJkc3Vkd2ZyY3R6bWlkbHhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMTA2NzcsImV4cCI6MjA2MTc4NjY3N30.EpZFTaSGHvkACdI9cqQNpKu2mSLAuTGDWEpEuvzUVMQ';
  const { createClient } = supabase;
  const supabaseClient = createClient(supabaseUrl, supabaseKey);

  const contenedor = document.getElementById('contenedor-empleados');
  const loadingContainer = document.getElementById('loading-container');

  async function cargarEmpleados() {
    loadingContainer.style.display = 'flex';
    contenedor.style.display = 'none';
    contenedor.innerHTML = '';

    const { data, error } = await supabaseClient
      .from('empleados_activos')
      .select('*');

    loadingContainer.style.display = 'none';
    contenedor.style.display = 'grid';

    if (error) {
      contenedor.innerHTML = '<p style="color:red;">Error al cargar empleados.</p>';
      console.error(error);
      return;
    }
    if (!data || data.length === 0) {
      contenedor.innerHTML = '<p>No hay empleados registrados.</p>';
      return;
    }

    data.forEach(emp => {
      const tarjeta = document.createElement('div');
      tarjeta.className = 'card';
      tarjeta.innerHTML = `
        <img src="${emp.foto}" alt="Foto de ${emp.nombre}" />
        <div class="nombre">${emp.nombre} ${emp.apellido}</div>
      `;
      tarjeta.addEventListener('click', () => eliminarEmpleado(emp));
      contenedor.appendChild(tarjeta);
    });
  }

  async function eliminarEmpleado(emp) {
    const confirmar = confirm(`¿Seguro que quieres eliminar a ${emp.nombre} ${emp.apellido}?`);
    if (!confirmar) return;

    const { error } = await supabaseClient
      .from('empleados_activos')
      .delete()
      .eq('rut', emp.rut);

    if (error) {
      alert('❌ Error al eliminar empleado.');
      console.error(error);
    } else {
      alert(`✅ ${emp.nombre} ${emp.apellido} eliminado correctamente.`);
      cargarEmpleados();
    }
  }

  window.cerrarSesion = () => {
    sessionStorage.removeItem('logueado');
  };

  cargarEmpleados();
});
