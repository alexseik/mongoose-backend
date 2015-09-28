/*global require,module*/

var convict = require('convict');

var conf = convict({
    env: {
        doc: "The applicaton environment.",
        format: ["production", "development", "test"],
        default: "development",
        env: "NODE_ENV",
        arg: "node-env"
    },
    server: {
        ip: {
            doc: "IP address to bind",
            format: 'ipaddress',
            default: '0.0.0.0'
        },
        port: {
            doc: "port to bind",
            format: 'port',
            default: 8080
        }
    },
    database: {
        host: {
            doc: "Database host name/IP",
            format: String,
            default: 'testing'
        },
        name: {
            doc: "Database name",
            format: String,
            default: 'users'
        }
    }
});



// Load environment dependent configuration
var env = conf.get('env');
conf.loadFile('./config/' + env + '.json');

// Perform validation
conf.validate({strict: true});

module.exports = conf;