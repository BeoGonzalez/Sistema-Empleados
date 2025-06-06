window.onload = async () => {
    const supabaseUrl = 'https://bsrrdsudwfrctzmidlxd.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzcnJkc3Vkd2ZyY3R6bWlkbHhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMTA2NzcsImV4cCI6MjA2MTc4NjY3N30.EpZFTaSGHvkACdI9cqQNpKu2mSLAuTGDWEpEuvzUVMQ';
    const { createClient } = supabase;
    const supabaseClient = createClient(supabaseUrl, supabaseKey);
  
    const contenedor = document.getElementById('contenedor-empleados');
  
    async function cargarEmpleados() {
      try {
        const { data, error } = await supabaseClient
          .from('empleados_activos')
          .select('*');
  
        if (error) {
          contenedor.innerHTML = '<p style="color:red;">Error al cargar empleados.</p>';
          console.error(error);
          return;
        }
  
        contenedor.innerHTML = '';
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
      } catch (err) {
        console.error('❌ Error general:', err);
        contenedor.innerHTML = '<p style="color:red;">Error inesperado al cargar empleados.</p>';
      }
    }
  
    async function eliminarEmpleado(emp) {
      const confirmar = confirm(`¿Estás seguro que quieres eliminar a ${emp.nombre} ${emp.apellido}?`);
      if (!confirmar) return;
  
      const { error } = await supabaseClient
        .from('empleados_activos')
        .delete()
        .eq('rut', emp.rut);
  
      if (error) {
        alert('❌ Error al eliminar empleado.');
        console.error(error);
      } else {
        alert(`✅ Empleado ${emp.nombre} ${emp.apellido} eliminado correctamente.`);
        cargarEmpleados();  
      }
    }
  
    cargarEmpleados();
  };
  