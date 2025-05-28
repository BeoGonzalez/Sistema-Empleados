window.onload = async () => {
  const supabaseUrl = 'https://bsrrdsudwfrctzmidlxd.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzcnJkc3Vkd2ZyY3R6bWlkbHhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMTA2NzcsImV4cCI6MjA2MTc4NjY3N30.EpZFTaSGHvkACdI9cqQNpKu2mSLAuTGDWEpEuvzUVMQ';
  const { createClient } = supabase;
  const supabaseClient = createClient(supabaseUrl, supabaseKey);

  const contenedor = document.getElementById('contenedor-empleados');
  const formContainer = document.getElementById('formulario-actualizar');
  const volverBtn = document.getElementById('volver-lista');
  const sueldoInput = document.getElementById('sueldo');

  sueldoInput.addEventListener('input', (e) => {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor === '') {
      e.target.value = '';
      return;
    }
    valor = parseInt(valor).toLocaleString('es-CL');
    e.target.value = `$${valor}`;
  });

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
      tarjeta.addEventListener('click', () => mostrarFormulario(emp));
      contenedor.appendChild(tarjeta);
    });
  } catch (err) {
    console.error('❌ Error general:', err);
    contenedor.innerHTML = '<p style="color:red;">Error inesperado al cargar empleados.</p>';
  }

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
    form.onsubmit = async (e) => {
      e.preventDefault();

      const nombre = document.getElementById('nombre').value;
      const apellido = document.getElementById('apellido').value;
      const cargo = document.getElementById('cargo').value;
      const departamento = document.getElementById('departamento').value;

      const sueldoRaw = document.getElementById('sueldo').value.replace(/\D/g, '');
      const sueldo = parseFloat(sueldoRaw);

      const archivo = document.getElementById('foto').files[0];

      let base64Foto = emp.foto;
      if (archivo) {
        const reader = new FileReader();
        base64Foto = await new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(archivo);
        });
      }

      const { error: updateError } = await supabaseClient
        .from('empleados_activos')
        .update({ nombre, apellido, cargo, departamento, sueldo, foto: base64Foto })
        .eq('rut', emp.rut);

      if (updateError) {
        console.error('❌ Error al actualizar:', updateError);
        alert('❌ Ocurrió un error al actualizar.');
      } else {
        alert('✅ Empleado actualizado con éxito.');
        window.location.reload();
      }
    };
  }

  volverBtn.addEventListener('click', (e) => {
    e.preventDefault();
    formContainer.style.display = 'none';
    contenedor.style.display = 'grid';
  });
};
