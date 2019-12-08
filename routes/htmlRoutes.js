const db = require("../models");
const mongoose = require("mongoose");

module.exports = function (app) {
    // Load index page
    app.get("/", function (req, res) {
        db.Article.find({}).sort({createdAt: -1})
            .then(function (dbArticles) {
                // If we were able to successfully find Articles, render the index page
                res.render("index",
                    {
                        js_file: "index.js",
                        articles: dbArticles,
                        savedSwitch: false
                    }
                )
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // Only load saved articles
    app.get("/saved", function (req, res) {
        db.Article.find({saved: true}).sort({createdAt: -1})
            .then(function (dbArticles) {
                // If we were able to successfully find Articles, render the index page
                res.render("index",
                    {
                        js_file: "index.js",
                        articles: dbArticles,
                        savedSwitch: true
                    }
                )
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    //display article and any associated notes
    app.get("/article/:id", function (req, res) {
        db.Article.findById({ _id: mongoose.Types.ObjectId(req.params.id) }).populate("notes").then(data => {
            res.render("article", { article: data, js_file: "article.js" });
        }).catch(err => {
            res.status(500).json(err);
        });
    });

    // Render 404 page for any unmatched routes
    app.get("*", function (req, res) {
        res.render("404");
    });
};