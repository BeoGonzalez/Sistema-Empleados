window.onload = async () => {
  const supabaseUrl = 'https://bsrrdsudwfrctzmidlxd.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzcnJkc3Vkd2ZyY3R6bWlkbHhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMTA2NzcsImV4cCI6MjA2MTc4NjY3N30.EpZFTaSGHvkACdI9cqQNpKu2mSLAuTGDWEpEuvzUVMQ';
  const { createClient } = supabase;
  const supabaseClient = createClient(supabaseUrl, supabaseKey);

  const contenedor = document.getElementById('contenedor-empleados');
  const loader = document.getElementById('loader');

  if (!contenedor) {
    console.error("⚠️ No se encontró el contenedor con id 'contenedor-empleados'");
    return;
  }

  loader.style.display = 'block'; // mostrar loader al inicio

  try {
    const { data, error } = await supabaseClient
      .from('empleados_activos')
      .select('*');

    loader.style.display = 'none'; // ocultar loader al terminar

    contenedor.innerHTML = '';

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
      contenedor.appendChild(tarjeta);
    });
  } catch (err) {
    loader.style.display = 'none'; // ocultar loader en error también
    console.error('❌ Error general:', err);
    contenedor.innerHTML = '<p style="color:red;">Error inesperado al cargar empleados.</p>';
  }
};
