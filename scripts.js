
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://lfepjfbynjdipsesbtdc.supabase.co'
const supabaseKey = process.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmZXBqZmJ5bmpkaXBzZXNidGRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDEyNTgzMDAsImV4cCI6MjAxNjgzNDMwMH0.ZN5u1xj78Te7peGHBnpHGpPI85ZCsA5XjtaKwh2x7j8
const supabase = createClient(supabaseUrl, supabaseKey)


// MODELO DE DATOS
let mis_peliculas_iniciales = [
    {titulo: "Interstellar",  director: "Christopher Nolan", "miniatura": "files/interstellar.png"},
    {titulo: "Jurassic Park", director: "Steven Spielberg", "miniatura": "files/jurassicpark.png"},
    {titulo: "Superlópez",   director: "Javier Ruiz Caldera", "miniatura": "files/superlopez.png"}
];

// Verificar si ya hay datos en Supabase, si no, insertar los datos iniciales
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
        console.error('Error durante la configuración de Supabase:', error.message);
    }
}

// VISTAS
const indexView = (peliculas) => {
    let i = 0;
    let view = "";

    while (i < peliculas.length) {
        view += `
        <div class="movie">
           <div class="movie-img">
                <img data-my-id="${i}" src="${peliculas[i].miniatura}" onerror="this.src='files/placeholder.png'"/>
           </div>
           <div class="title">
               ${peliculas[i].titulo || "<em>Sin título</em>"}
           </div>
           <div class="actions">
               <button class="edit" data-my-id="${i}">editar</button>
               <button class="delete" data-my-id="${i}">borrar</button>
               <button class="show" data-my-id="${i}">ver</button>
            </div>
        </div>\n`;
        i = i + 1;
    }

    view += `<div class="actions">
                <button class="new">añadir</button>
                <button class="reset">reset</button>
            </div>`;

    return view;
};

const editView = (i, pelicula) => {
    return `<h2>Editar Película </h2>
        <div class="field">
        Título <br>
        <input  type="text" id="titulo" placeholder="Título" 
                value="${pelicula.titulo}">
        </div>
        <div class="field">
        Director <br>
        <input  type="text" id="director" placeholder="Director" 
                value="${pelicula.director}">
        </div>
        <div class="field">
        Miniatura <br>
        <input  type="text" id="miniatura" placeholder="URL de la miniatura" 
                value="${pelicula.miniatura}">
        </div>
        <div class="actions">
            <button class="update" data-my-id="${i}">
                Actualizar
            </button>
            <button class="index">
                Volver
            </button>
       `;
};

const showView = (pelicula) => {
    return `
     <h2>${pelicula.titulo}</h2>
     <p>Director: ${pelicula.director}</p>
     <div class="movie-img">
        <img src="${pelicula.miniatura}" onerror="this.src='files/placeholder.png'"/>
     </div>
     <div class="actions">
        <button class="index">Volver</button>
     </div>`;
};

const newView = () => {
    return `<h2>Crear Película</h2>
        <div class="field">
        Título <br>
        <input  type="text" id="titulo" placeholder="Título">
        </div>
        <div class="field">
        Director <br>
        <input  type="text" id="director" placeholder="Director">
        </div>
        <div class="field">
        Miniatura <br>
        <input  type="text" id="miniatura" placeholder="URL de la miniatura">
        </div>
        <div class="actions">
            <button class="create">
                Crear
            </button>
            <button class="index">
                Volver
            </button>
        </div>`;
};

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
    }
};

// ROUTER de eventos
const matchEvent = (ev, sel) => ev.target.matches(sel);
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
document.addEventListener('DOMContentLoaded', indexContr);

