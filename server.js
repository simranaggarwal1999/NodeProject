//"home Page","","/"
//"product"=>Product Page
//"/api"=>display data.json to browser
//Error 404 Page not found
var http = require("http");
var fs = require("fs");
var url = require("url");
var json = fs.readFileSync("./data.json");
var template = fs.readFileSync("./templates/product.html");
template = template + "";
var overviewtemplate = fs.readFileSync("./templates/overview.html");
overviewtemplate = overviewtemplate + "";
var cardtemplate = fs.readFileSync("./templates/card.html");
cardtemplate = cardtemplate + "";


//convert from buffer to object
json = JSON.parse(json);

function replace(template, product) {
    template = template.replace(/#ProductName#/g, product["productName"]);
    template = template.replace(/#image#/g, product["image"]);
    template = template.replace(/#From#/g, product["from"]);
    template = template.replace(/#Nutirents#/g, product["nutrients"]);
    template = template.replace(/#Quantity#/g, product["quantity"]);
    template = template.replace(/#Price#/g, product["price"]);
    template = template.replace(/#Description#/g, product["description"]);
    template = template.replace(/#CardLink#/g,product["id"]);
    if(!product["organic"])
    {
        template = template.replace(/#not-organic#/g,"not-organic");
    }
    // template=template.replace(/#Is#/g,product["organic"]===true?"":"Not");
    return template;
}

var server = http.createServer(function (req, res) {
    // console.log(req.url);
    // res.write("Response from home");
    var parsedUrl = url.parse(req.url, true);
    var pathName = parsedUrl["pathname"];
    var id = parsedUrl["query"]["id"];
    if (req.url === "/home page" || req.url === " " || req.url === "/") {
        var cards="";
        for(var i=0;i<json.length;i++)
        {
            cards=cards+replace(cardtemplate,json[i]);   
        }

        overviewtemplate = overviewtemplate.replace(/{%cardscontainer%}/g, cards);
        res.write(overviewtemplate);
    }
    else if (pathName === "/product") {
        var productPage = replace(template, json[id]);
        res.write(productPage);
    }
    else if (req.url === "/api") {
        res.write(json);
    }
    else {
        res.write("<h1>Error 404 Page not found</h1>");
    }
    res.end();
});

server.listen(3000, function () {
    console.log("Server is listening at 3000");
});