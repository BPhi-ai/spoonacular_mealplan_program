const connect = async () => {
    try {
        console.log('Connected to database.');
    } catch (error) {
        console.error('Database connection error: ', error);
        process.exit(1); 
    }
};

export default {connect};