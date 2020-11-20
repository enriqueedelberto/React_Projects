import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MovieList from './components/MovieList';
import MovieListHeading from './components/MovieListHeading';
import SearchBox from './components/SearchBox';
import AddFavourite from './components/AddFavourite';
import RemoveFavourites from './components/RemoveFavourites';



const App =()=> {
  const [movies, setMovies] = useState ([ ]);
  const [searchValue, setSearchValue] = useState ('');
  const [favourites, setFavourites] = useState([]);

  const getMovieRequest = async (searchValue) => {
    const url =  `http://www.omdbapi.com/?s=${searchValue}&apikey=263d22d8`;
    const response = await fetch(url);
    const responseJson = await response.json();

    if (responseJson.Search) {
			setMovies(responseJson.Search);
		}
  }

  

  useEffect(() => {
		getMovieRequest(searchValue);
  }, [searchValue]);
  
  useEffect(() => {
    const movieFavourites = JSON.parse(
      localStorage.getItem('movie-app-favourites')
    );

    if (movieFavourites) {
      setFavourites(movieFavourites);
    }
    
  },[]);

  const saveToLocalStorage = (items) => {
    localStorage.setItem('movie-app-favourites', JSON.stringify(items));
  };

  const AddFavouriteMovie = (movie) => {
    const newFavouriteList= [...favourites, movie];
    setFavourites(newFavouriteList);
    saveToLocalStorage(newFavouriteList);
  };

  const RemoveFavouriteMovie = (movie) => {
    const newFavouriteList = favourites.filter( 
       (favourite) => favourite.imdbID !== movie.imdbID
    );
    setFavourites(newFavouriteList);
    saveToLocalStorage(newFavouriteList);
  };



  return (
    <div className="container-fluid movie-app">
      <div className='row d-flex align-items-center mt-4 mb-4'>
          <MovieListHeading heading='Movies' />
          <SearchBox searchValue={searchValue} setSearchValue={setSearchValue} />
      </div> 
       <div className="row">
         <MovieList movies={movies}
           favouriteComponent={AddFavourite}
           handleFavouritesClick={AddFavouriteMovie}
         />
       </div>

       <div className='row d-flex align-items-center mt-4 mb-4'>
				<MovieListHeading heading='Favourites' />
			</div>

      <div className='row'>
        <MovieList movies={favourites}
          handleFavouritesClick={RemoveFavouriteMovie}
          favouriteComponent={RemoveFavourites}
           />
      </div>



    </div>
  );
}

export default App;
