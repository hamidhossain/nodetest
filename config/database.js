if (process.env.NODE_ENV === "production") {
    module.exports = {
        mongoURI: "mongodb://hamid:dimahdimah11@ds155815.mlab.com:55815/hamid-node1"
    };
} else {
    module.exports = {
        mongoURI: "mongodb://localhost/TestDB"
    };
}
