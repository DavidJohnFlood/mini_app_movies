const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;
const knex = require('knex')(require('./knexfile.js')['development'])

app.use(express.json())
app.use(express.text())
app.use(cors())

app.listen(port, ()=> {console.log(`Server listening on port ${port}`)})

app.get('/', (req, res) =>{
    res.send('Application up and running.')
})

app.get('/movies', (req, res) =>{
    knex.select('*')
        .from('movies')
        .then(movies => { res.status(200).json(movies) })
        .catch(err => { res.status(500).json({message: err}) })
})

app.post('/movies', (req, res) =>{
    const { tmdb_id, title, overview, release_date, poster_path, vote_average, vote_count } = req.body;
    console.log({ tmdb_id, title, overview, release_date, poster_path, vote_average, vote_count })
    knex.select('*')
    .from('movies')
    .where('tmdb_id', tmdb_id)
    .then((data) => {
        if (data.length > 0){
            res.status(404).json({movieCreated: false, message: `Movie already saved!`});
        }else{
            knex('movies')
            .insert({ tmdb_id, title, overview, release_date, poster_path, vote_average, vote_count })
            .then(() => res.status(201).json({movieCreated: true, message: 'Movie added successfully!'}))
        }
    })
    .catch((err) =>
        res.status(500).json({
        message: 'An error occurred while posting the movie!',
        error: err,
        })
    );
});