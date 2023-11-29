// MODELO DE DATOS

import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://lfepjfbynjdipsesbtdc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmZXBqZmJ5bmpkaXBzZXNidGRjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMTI1ODMwMCwiZXhwIjoyMDE2ODM0MzAwfQ.ZwFKdV1kIUtUL2QAp4aJrhBaxw7XxpgcAyWf-0JicHc'
const supabase = createClient(supabaseUrl, supabaseKey)


// MODELO DE DATOS
let mis_peliculas_iniciales = [
 let mis_peliculas_iniciales = [
    {titulo: "Interstellar",  director: "Christopher Nolan", "miniatura": "files/interstellar.png"},
    {titulo: "Jurassic Park", director: "Steven Spielberg", "miniatura": "files/jurassicpark.png"},
    {titulo: "Superlópez",   director: "Javier Ruiz Caldera", "miniatura": "files/superlopez.png"}
];

// ...
async function setupSupabase() {
    try {
        const { data, error } = await supabase.from('peliculas').select('*');

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            // Insertar datos iniciales
            await supabase.from('peliculas').insert(mis_peliculas_iniciales);
        }
    } catch (error) {
        console.error('Error durante la configuración de Supabase:', error);
    }
}
// ...

localStorage.mis_peliculas = localStorage.mis_peliculas || JSON.stringify(mis_peliculas_iniciales);

// VISTAS
const indexView = (peliculas) => {
    let i = 0;
    let i=0;
    let view = "";

    while (i < peliculas.length) {
        view += `
    while(i < peliculas.length) {
      view += `
        <div class="movie">
           <div class="movie-img">
                <img data-my-id="${i}" src="${peliculas[i].miniatura}" onerror="this.src='files/placeholder.png'"/>
@@ -52,8 +28,8 @@ const indexView = (peliculas) => {
               <button class="show" data-my-id="${i}">ver</button>
            </div>
        </div>\n`;
        i = i + 1;
    }
      i = i + 1;
    };

    view += `<div class="actions">
                <button class="new">añadir</button>
@@ -88,7 +64,7 @@ const editView = (i, pelicula) => {
                Volver
            </button>
       `;
};
}

const showView = (pelicula) => {
    return `
@@ -100,7 +76,7 @@ const showView = (pelicula) => {
     <div class="actions">
        <button class="index">Volver</button>
     </div>`;
};
}

const newView = () => {
    return `<h2>Crear Película</h2>
@@ -124,138 +100,64 @@ const newView = () => {
                Volver
            </button>
        </div>`;
};
}

// CONTROLADORES 
const indexContr = async () => {
    try {
        await setupSupabase();

        const { data: peliculas, error } = await supabase.from('peliculas').select('*');

        if (error) {
            throw error;
        }

        document.getElementById('main').innerHTML = indexView(peliculas);
    } catch (error) {
        console.error('Error al obtener las películas:', error.message);
    }
const indexContr = () => {
    let mis_peliculas = JSON.parse(localStorage.mis_peliculas);
    document.getElementById('main').innerHTML = indexView(mis_peliculas);
};

const showContr = async (i) => {
    try {
        const { data: peliculas, error } = await supabase.from('peliculas').select('*');

        if (error) {
            throw error;
        }

        document.getElementById('main').innerHTML = showView(peliculas[i]);
    } catch (error) {
        console.error('Error al obtener la película:', error.message);
    }
const showContr = (i) => {
    let mis_peliculas = JSON.parse(localStorage.mis_peliculas);
    document.getElementById('main').innerHTML = showView(mis_peliculas[i]);
};

const newContr = () => {
    document.getElementById('main').innerHTML = newView();
};

const createContr = async () => {
    try {
        const nuevaPelicula = {
            titulo: document.getElementById('titulo').value,
            director: document.getElementById('director').value,
            miniatura: document.getElementById('miniatura').value
        };

        const { data: peliculaCreada, error } = await supabase.from('peliculas').insert([nuevaPelicula]);

        if (error) {
            throw error;
        }

        indexContr();
    } catch (error) {
        console.error('Error al crear la película:', error.message);
    }
const createContr = () => {
    let nuevaPelicula = {
        titulo: document.getElementById('titulo').value,
        director: document.getElementById('director').value,
        miniatura: document.getElementById('miniatura').value
    };
    let mis_peliculas = JSON.parse(localStorage.mis_peliculas);
    mis_peliculas.push(nuevaPelicula);
    localStorage.mis_peliculas = JSON.stringify(mis_peliculas);
    indexContr();
};

const editContr = async (i) => {
    try {
        const { data: peliculas, error } = await supabase.from('peliculas').select('*');

        if (error) {
            throw error;
        }

        const pelicula = peliculas[i];
        document.getElementById('main').innerHTML = editView(i, pelicula);
    } catch (error) {
        console.error('Error al obtener la película:', error.message);
    }
const editContr = (i) => {
    let pelicula = JSON.parse(localStorage.mis_peliculas)[i];
    document.getElementById('main').innerHTML = editView(i, pelicula);
};

const updateContr = async (i) => {
    try {
        const { data: peliculas, error } = await supabase.from('peliculas').select('*');

        if (error) {
            throw error;
        }

        const mis_peliculas = peliculas;
        mis_peliculas[i].titulo = document.getElementById('titulo').value;
        mis_peliculas[i].director = document.getElementById('director').value;
        mis_peliculas[i].miniatura = document.getElementById('miniatura').value;

        const { data: updatedPeliculas, updateError } = await supabase.from('peliculas').upsert(mis_peliculas);

        if (updateError) {
            throw updateError;
        }

        indexContr();
    } catch (error) {
        console.error('Error al actualizar la película:', error.message);
    }
const updateContr = (i) => {
    let mis_peliculas = JSON.parse(localStorage.mis_peliculas);
    mis_peliculas[i].titulo    = document.getElementById('titulo').value;
    mis_peliculas[i].director  = document.getElementById('director').value;
    mis_peliculas[i].miniatura = document.getElementById('miniatura').value;
    localStorage.mis_peliculas = JSON.stringify(mis_peliculas);
    indexContr();
};

const deleteContr = async (i) => {
    try {
        let confirmacion = confirm("¿Estás seguro de que quieres eliminar esta película?");
        if (confirmacion) {
            const { data: peliculas, error } = await supabase.from('peliculas').select('*');

            if (error) {
                throw error;
            }

            const mis_peliculas = peliculas;
            mis_peliculas.splice(i, 1);

            const { data: deletedPeliculas, deleteError } = await supabase.from('peliculas').upsert(mis_peliculas);

            if (deleteError) {
                throw deleteError;
            }

            indexContr();
        }
    } catch (error) {
        console.error('Error al eliminar la película:', error.message);
const deleteContr = (i) => {
    let confirmacion = confirm("¿Estás seguro de que quieres eliminar esta película?");
    if (confirmacion) {
        let mis_peliculas = JSON.parse(localStorage.mis_peliculas);
        mis_peliculas.splice(i, 1);
        localStorage.mis_peliculas = JSON.stringify(mis_peliculas);
        indexContr();
    }
};

const resetContr = async () => {
    try {
        let confirmacion = confirm("¿Estás seguro de que quieres restaurar las películas originales?");
        if (confirmacion) {
            await supabase.from('peliculas').upsert(mis_peliculas_iniciales);
            indexContr();
        }
    } catch (error) {
        console.error('Error al restablecer las películas originales:', error.message);
const resetContr = () => {
    let confirmacion = confirm("¿Estás seguro de que quieres restaurar las películas originales?");
    if (confirmacion) {
        localStorage.mis_peliculas = JSON.stringify(mis_peliculas_iniciales);
        indexContr();
    }
};

@@ -264,16 +166,15 @@ const matchEvent = (ev, sel) => ev.target.matches(sel);
const myId = (ev) => Number(ev.target.dataset.myId);

document.addEventListener('click', ev => {
    if (matchEvent(ev, '.index'))  indexContr();
    else if (matchEvent(ev, '.edit'))   editContr(myId(ev));
    else if (matchEvent(ev, '.update')) updateContr(myId(ev));
    else if (matchEvent(ev, '.delete')) deleteContr(myId(ev));
    else if (matchEvent(ev, '.reset'))  resetContr();
    else if (matchEvent(ev, '.show'))   showContr(myId(ev));
    else if (matchEvent(ev, '.new'))    newContr();
    else if (matchEvent(ev, '.create')) createContr();
});

// Inicialización
    if      (matchEvent(ev, '.index'))  indexContr  ();
    else if (matchEvent(ev, '.edit'))   editContr   (myId(ev));
    else if (matchEvent(ev, '.update')) updateContr (myId(ev));
    else if (matchEvent(ev, '.delete')) deleteContr (myId(ev));
    else if (matchEvent(ev, '.reset'))  resetContr  ();
    else if (matchEvent(ev, '.show'))   showContr   (myId(ev));
    else if (matchEvent(ev, '.new'))    newContr    ();
    else if (matchEvent(ev, '.create')) createContr ();
})

// Inicialización        
document.addEventListener('DOMContentLoaded', indexContr);
