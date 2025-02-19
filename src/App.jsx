import React, { useState, useEffect } from 'react'
import { useDebounce } from 'react-use';
import './App.css'
import Buscar from './components/Buscar'
import Carga from './components/Carga';
import Pelicula from './components/Pelicula';
import { updatebuscador, getPopular } from './appwrite';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiODAzN2JmMGI3YmFlOTdmMDNhMzU5NjJmOGZlYmRhNSIsIm5iZiI6MTczOTk3NjY2Ni4zMzUsInN1YiI6IjY3YjVlZmRhMjE1MjYzOGY1ZWUzZTZjMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.F9ccmeZw6qQ6bcvujSeMu499xOI48S-1Xk41TqFcI_M";

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

function App() {
  const [buscartitulo, setBuscartitulo] = useState('')
  const [movies, setMovies] = useState([]);
  const [popular, setPopular] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debounceBuscarTitulo, setDebounceBuscarTitulo] = useState('')

  useDebounce(() => {
    setDebounceBuscarTitulo(buscartitulo)
  }
    , 5000, [buscartitulo])

  const fetchMovies = async (query = '') => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` :
        `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(
        endpoint,
        API_OPTIONS
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.errors) {
        throw new Error(data.errors);
      }
      setMovies(data.results);

      if (query && data.results.length > 0) {
        await updatebuscador(query, data.results[0]);
      }

      return;
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  const fetchPopular = async () => {
    try {
      const popular = await getPopular();
      setPopular(popular);
    }
    catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchMovies(debounceBuscarTitulo);
  }
    , [debounceBuscarTitulo])
  useEffect(() => {
    fetchPopular();
  }
    , [])
  return (
    <main>
      <div className='pattern'>
        <div className='wrapper'>
          <header>
            <img src="./hero.png" alt="Banner" />
            <h1>Encuentra <span className='text-gradient'>Peliculas </span> para el aburrimiento.
            </h1>
            <Buscar buscartitulo={buscartitulo} setBuscartitulo={setBuscartitulo} />
          </header>

          {popular.length > 0 && (
            <section className='trending'>
              <h2 className='mt-[40px]'>Populares</h2>
              <ul>
                {popular.map((movie, index) => (
                  <li key={movie.$id}>
                    <p>{index + 1}</p>
                    <img src={movie.poster_url} alt={movie.title} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className='all-movies'>
            <h2 className='mt-[40px]'>Peliculas</h2>
            {loading ? (<Carga />) : error ?
              (<p className='text-red-500'>Error: {error.message}</p>)
              :
              (
                <ul>
                  {movies.map((movie) => (
                    <Pelicula key={movie.id} movie={movie} />
                  ))}
                </ul>
              )}
          </section>

        </div>

      </div>
    </main>
  )
}

export default App
