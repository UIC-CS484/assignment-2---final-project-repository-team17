const express = require('express')
const putMoviesData = require('../../dao/movies/index')
const getMoviesData = require('../../dao/movies/index')
const router = express.Router()

router.get('/', async function (req, res) {
    if(req.isAuthenticated()){
        try{           
            putMoviesData.putMoviesData(req,res) 
            getMoviesData.getMoviesData(req,res)
            res.redirect('home')
        }
        catch(error)
        {
            console.log(error)
        }
    }
    else{
        res.redirect('signin')
    }
})

module.exports = router