var express = require("express");
var app = express();
app.listen(process.env.PORT || 3000, function() {
  console.log('listening on 3000')
})
app.use(express.static('public'));

app.get("/", function(req, res) {
    res.render('index.html');
})
