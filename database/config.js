require('colors');
const mongoose = require('mongoose');

const dbConnection = async() => {
    try {
        console.log('Conectando a la base de datos...');
        
        await mongoose.connect( process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false
        });

        console.log('Database status:', '[Online]'.green);

    } catch (error) {
        console.log(error);
        console.log('Database status:', '[Error]'.red);
        throw new Error('Error al iniciar la DB');
    }
}


module.exports = {
    dbConnection
}