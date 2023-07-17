import './App.css';
import { useState } from 'react'
import styled from 'styled-components'
const APIKEY = "";

// const movies = [
//     {title: 'Mean Girls'},
//     {title: 'Hackers'},
//     {title: 'The Grey'},
//     {title: 'Sunshine'},
//     {title: 'Ex Machina'},
//   ];
const Header = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 30px;
    justify-content: center;
`
const Details = styled.div`
    width: 80%;
    display: flex;
    flex-direction: row;
    gap: 30px;
    justify-content: center;
    padding-left: 10%;
    padding-right: 10%;

`

function App() {
    const [ ApiMovieData, setApiMovieData ] = useState([])
    const [ myMovieData, setMyMovieData ] = useState([])
    const [ searchString, setSearchString ] = useState("")
    const [ viewWatched, setViewWatched ] = useState(false)
    const [ selectedMovie, setSelectedMovie ] = useState(null)

    // useEffect(() => {
    //     fetch('http://localhost:8080/movies')
    //         .then(res=> res.json())
    //         .then(data=>setMovieData(data))
    //         .catch(err=>console.log(`Fetch failed. Error: ${err}`))
    // }, []);



    return (
        <div className="App">
            <header className="App-header">
                <Header>
                    <SearchBar />
                    <AddBar />
                </Header><br/>

                <Details>
                    {ApiMovieData.length===0?<></>:
                    <>
                        <img style={{objectFit: "none"}} src={`https://image.tmdb.org/t/p/w200${ApiMovieData.results[0].poster_path}`} alt=""/>
                        <div>
                            <h2>{selectedMovie.title}{selectedMovie.watched?" (Watched)":" (Unwatched)"}</h2>
                            <p>{ApiMovieData.results[0].overview}</p>
                            {selectedMovie.watched?<></>:<p onClick={()=>setWatched(selectedMovie)}> ✔️mark as watched</p>}
                        </div>
                    </>}
                </Details>

                <h2>Movie List:   {<button onClick={()=>setViewWatched(!viewWatched)}>{viewWatched?"View Unwatched":"View Watched"}</button>}</h2>
                {myMovieData.filter((movie)=>movie.watched === viewWatched)
                            .filter((movie)=>movie.title.startsWith(searchString))
                            .map((movie,index)=>
                                <p key={index}>
                                    <span onClick={()=>handleTitleClick(movie)}>{movie.title}</span>
                                    {movie.watched?" (Watched)":" (Unwatched)"}
                                    <span onClick={()=>deleteMovie(movie)}>❌</span>
                                </p>
                            )
                }
            </header>
        </div>
    );

    function handleTitleClick(movie) {
        fetch(`https://api.themoviedb.org/3/search/movie?query=${movie.title}&api_key=${APIKEY}`)
            .then(res=> res.json())
            .then(data=>{
                console.log("data= ",data)
                setApiMovieData(data)
                setSelectedMovie(movie)
                const postData = {  tmdb_id: data.results[0].id,
                                    title: data.results[0].title,
                                    overview: data.results[0].overview,
                                    release_date: data.results[0].release_date,
                                    poster_path: data.results[0].poster_path,
                                    vote_average: data.results[0].vote_average,
                                    vote_count: data.results[0].vote_count}
                fetch("http://localhost:8080/movies/", {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(postData)
                })
                .then(response => console.log(response))
                .catch(error => console.error('Error:', error))

            })
            .catch(err=>console.log(`Fetch failed. Error: ${err}`))
    }

    function setWatched(movie) {
        setMyMovieData((prev)=> {
            const update = [...prev]
            update[update.findIndex((mov)=>mov===movie)].watched = true
            return update
        })
    }

    function deleteMovie(movie) {
        setMyMovieData((prev)=> {
            const update = [...prev]
            update.splice(update.findIndex((mov)=>mov===movie),1)
            return update
        })
    }

    function SearchBar() {
        return(
            <form onSubmit={(e)=>handleSubmit(e)}>
                <input type="search" name="search" placeholder="Search Here!" autoComplete="off"/>
                <input type="submit" value="Search" />
            </form>
        )

        function handleSubmit(event){
            event.preventDefault();
            console.log(event.target.search.value)
            setSearchString(event.target.search.value)
        }
    }

    function AddBar() {
        return(
            <form onSubmit={(e)=>handleSubmit(e)}>
                <input type="search" name="search" placeholder="Add a movie!" autoComplete="off" />
                <input type="submit" value="Add" />
            </form>
        )

        function handleSubmit(event){
            event.preventDefault();
            const newMovie = {title: event.target.search.value, watched: false}
            console.log(newMovie)
            setMyMovieData((prev)=> [...prev, newMovie])
        }
    }
}

export default App;
