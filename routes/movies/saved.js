const express = require('express')
const router = express.Router()
const getMoviesData = require('../../dao/movies/index')

router.get('/', async function (req,res){
    if(req.isAuthenticated()){
        try{
            let data = await getMoviesData.getMoviesData(req,res)
            console.log(data)
            res.render('record', {data: data})
        }
        catch(error){
            console.log(error)
        }
    }
})

module.exports = router