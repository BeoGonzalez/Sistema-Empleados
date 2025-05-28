window.onload = async () => {
    const supabaseUrl = 'https://bsrrdsudwfrctzmidlxd.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzcnJkc3Vkd2ZyY3R6bWlkbHhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMTA2NzcsImV4cCI6MjA2MTc4NjY3N30.EpZFTaSGHvkACdI9cqQNpKu2mSLAuTGDWEpEuvzUVMQ';
    const { createClient } = supabase;
    const supabaseClient = createClient(supabaseUrl, supabaseKey);
  
    const contenedor = document.getElementById('contenedor-empleados');
  
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
        contenedor.appendChild(tarjeta);
      });
    } catch (err) {
      console.error('❌ Error general:', err);
      contenedor.innerHTML = '<p style="color:red;">Error inesperado al cargar empleados.</p>';
    }
  };
  