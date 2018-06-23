module.exports = (function () {
    console.log('Environment:', process.env.NODE_ENV);
    switch (process.env.NODE_ENV) {
        case 'development':
            return {
                'port': 3000,
                'database': 'mongodb://pkm:prashant@123@ds245210.mlab.com:45210/techifyapp',
                'salt': '1234567890'
            }
        case 'staging':
            return {
                'port': 9061
            }
        case 'production':
            return {
                'port': 3001
            }
        case 'live':
            return {
                'port': 3000
            };
        default:
            console.log('No env');
            return {}
    }
})()
