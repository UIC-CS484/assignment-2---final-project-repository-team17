const { connect } = require('..')

async function putMoviesData(req,res){
    try{
        const db = await connect()
        let sql = 'INSERT INTO movielog values(?,?)'
        await db.run(sql,[req.query.mid,req.user.email])
    }
    catch(error){
        console.log(error)
    }
}

async function getMoviesData(req,res){
    try{
        const db = await connect()
        let sql = 'SELECT * from movielog where email = ?'
        let data = await db.all(sql,[req.user.email])
        return data
    }
    catch(error){
        console.log(error)
    }
}


module.exports = {
putMoviesData,
getMoviesData
}