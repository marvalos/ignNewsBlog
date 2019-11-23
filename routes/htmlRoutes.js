var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.render("index", {
        msg: "Welcome!",
        examples: dbExamples
      });
    });
  });

  // Load example page and pass in an example by id
  app.get("/example/:id", function(req, res) {
    db.Example.findOne({ where: { id: req.params.id } }).then(function(dbExample) {
      res.render("example", {
        example: dbExample
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};

// Scraping Route
app.get("/scrape", function (req, res) {
  db.scrapedData.remove({}, (removeError, removeData) => {
    if (removeError) {
      throw new Error(removeError)
    }
    else {
      axios.get("https://www.ign.com/").then(function (axiosResponse) {
        const $ = cheerio.load(axiosResponse.data);
        var results = []
        $(".four-up-items article").each((i, element) => {
          var title = $(element).find(".item-title-link").text();
          var link = $(element).find(".item-details >a").attr("href");
          results.push({
            title: title,
            link: link
          });
          console.log(results);

          if (title && link) {
            db.scrapedData.insert({
              title: title,
              link: link
            },
              function (err, inserted) {
                if (err) {
                  // Log the error if one is encountered during the query
                  console.log(err);
                }
                else {
                  // Otherwise, log the inserted data
                  console.log(inserted);
                }
              });
          }
        });
      })
    }
    res.send("Scrape Complete");
  });
})
