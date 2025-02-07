import React, { useEffect, useState } from "react";

import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import MovieList from './components/MovieList';
import Movie from './components/Movie';

import MovieHeader from './components/MovieHeader';

import FavoriteMovieList from './components/FavoriteMovieList';

import axios from 'axios';
import EditMovieForm from "./components/EditMovieForm";
import AddMovieForm from "./components/AddMovieForm";

const App = (props) => {
  const [movies, setMovies] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const history = useHistory();

  useEffect(()=>{
    axios.get('http://localhost:9000/api/movies')
      .then(res => {
        setMovies(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const deleteMovie = (id)=> {
    axios.delete(`http://localhost:9000/api/movies/${id}`)
            .then(res=>{
                setMovies(res.data)
                setFavoriteMovies(favoriteMovies.filter(fm=>(id!== fm.id) ))
                history.push("/movies");
			})
			.catch(err=>{
				console.log(err);
			})
  }

  const addToFavorites = (movie) => {
    let kontrol=true;
    favoriteMovies.forEach(fm => {
      if(fm["id"]==movie["id"]){
        kontrol=false;
      }
    })
    if(kontrol){
      setFavoriteMovies(
        [...favoriteMovies,movie]
      )
    }
  }

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark">
        <span className="navbar-brand" > HTTP / CRUD Module Project</span>
      </nav>

      <div className="container">
        <MovieHeader/>
        <div className="row ">
          <FavoriteMovieList favoriteMovies={favoriteMovies}/>
        
          <Switch>
            <Route path="/movies/edit/:id">
              <EditMovieForm setMovies={setMovies} setFavoriteMovies={setFavoriteMovies} favoriteMovies={favoriteMovies} />
            </Route>

            <Route path="/movies/add" >
              <AddMovieForm setMovies={setMovies} />
            </Route>

            <Route path="/movies/:id">
              <Movie deleteMovie={deleteMovie} addToFavorites={addToFavorites} />
            </Route>

            <Route path="/movies">
              <MovieList movies={movies}/>
            </Route>

            <Route path="/">
              <Redirect to="/movies"/>
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
};


export default App;

