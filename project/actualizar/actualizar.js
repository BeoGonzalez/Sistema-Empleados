window.addEventListener('DOMContentLoaded', () => {
  // Configuración Supabase
  const supabaseUrl = 'https://bsrrdsudwfrctzmidlxd.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzcnJkc3Vkd2ZyY3R6bWlkbHhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMTA2NzcsImV4cCI6MjA2MTc4NjY3N30.EpZFTaSGHvkACdI9cqQNpKu2mSLAuTGDWEpEuvzUVMQ';
  const { createClient } = supabase;
  const supabaseClient = createClient(supabaseUrl, supabaseKey);

  const contenedor = document.getElementById('contenedor-empleados');
  const loadingContainer = document.getElementById('loading-container');
  const formContainer = document.getElementById('formulario-actualizar');
  const volverBtn = document.getElementById('volver-lista');
  const sueldoInput = document.getElementById('sueldo');

  // Formatea sueldo en tiempo real
  sueldoInput.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '');
    e.target.value = v ? `$${parseInt(v).toLocaleString('es-CL')}` : '';
  });

  // Función para cargar empleados
  async function cargarEmpleados() {
    // mostrar loader, ocultar grid
    loadingContainer.style.display = 'flex';
    contenedor.style.display = 'none';
    formContainer.style.display = 'none';
    contenedor.innerHTML = '';

    const { data, error } = await supabaseClient
      .from('empleados_activos')
      .select('*');

    // ocultar loader y mostrar grid
    loadingContainer.style.display = 'none';
    contenedor.style.display = 'grid';

    if (error) {
      contenedor.innerHTML = '<p style="color:red;">Error al cargar empleados.</p>';
      console.error(error);
      return;
    }
    if (!data || !data.length) {
      contenedor.innerHTML = '<p>No hay empleados registrados.</p>';
      return;
    }

    data.forEach(emp => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${emp.foto}" alt="Foto de ${emp.nombre}" />
        <div class="nombre">${emp.nombre} ${emp.apellido}</div>
      `;
      card.addEventListener('click', () => mostrarFormulario(emp));
      contenedor.appendChild(card);
    });
  }

  // Muestra el form con datos para actualizar
  function mostrarFormulario(emp) {
    contenedor.style.display = 'none';
    formContainer.style.display = 'block';

    document.getElementById('nombre').value = emp.nombre;
    document.getElementById('apellido').value = emp.apellido;
    document.getElementById('rut-num').value = emp.rut;
    document.getElementById('rut-dv').value = emp.dv;
    document.getElementById('cargo').value = emp.cargo;
    document.getElementById('departamento').value = emp.departamento;
    document.getElementById('sueldo').value = `$${parseInt(emp.sueldo).toLocaleString('es-CL')}`;

    const form = document.getElementById('actualizar-form');
    form.onsubmit = async e => {
      e.preventDefault();
      // recoge datos
      const nombre     = document.getElementById('nombre').value;
      const apellido   = document.getElementById('apellido').value;
      const cargo      = document.getElementById('cargo').value;
      const departamento = document.getElementById('departamento').value;
      const sueldoRaw  = document.getElementById('sueldo').value.replace(/\D/g, '');
      const sueldo     = parseFloat(sueldoRaw) || 0;

      // maneja la foto
      const file = document.getElementById('foto').files[0];
      let fotoBase64 = emp.foto;
      if (file) {
        fotoBase64 = await new Promise((res, rej) => {
          const reader = new FileReader();
          reader.onloadend  = () => res(reader.result);
          reader.onerror    = () => rej('error lectura archivo');
          reader.readAsDataURL(file);
        });
      }

      // actualiza en Supabase
      const { error: updateError } = await supabaseClient
        .from('empleados_activos')
        .update({ nombre, apellido, cargo, departamento, sueldo, foto: fotoBase64 })
        .eq('rut', emp.rut);

      if (updateError) {
        console.error(updateError);
        alert('❌ Ocurrió un error al actualizar.');
      } else {
        alert('✅ Empleado actualizado con éxito.');
        cargarEmpleados();
      }
    };
  }

  // Vuelve a la lista
  volverBtn.addEventListener('click', e => {
    e.preventDefault();
    formContainer.style.display = 'none';
    contenedor.style.display = 'grid';
  });

  // Cerrar sesión
  window.cerrarSesion = () => {
    sessionStorage.removeItem('logueado');
  };

  // Lanza carga inicial
  cargarEmpleados();
});
