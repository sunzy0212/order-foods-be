/**
 * Created by zhiyuans on 12/4/2015.
 */
var app = require('./app');

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});
