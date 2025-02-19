import React from 'react'

const Buscar = ({buscartitulo, setBuscartitulo}) => {
  return (
    <div className='search'>
        <div>
            <img src="./search.svg" alt="search" />
            <input 
            type="text" 
            placeholder="Buscar Peliculas" 
            value={buscartitulo} 
            onChange={(e) => setBuscartitulo(e.target.value)} />
        </div>
    </div>
  )
}

export default Buscar