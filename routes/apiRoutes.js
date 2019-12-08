const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models");
const mongoose = require("mongoose");

module.exports = function (app) {
  // Scraping Route
  app.get("/scrape", function (req, res) {
    let articleCount = 0;
    db.Article.remove({}, (removeError, removeData) => {
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

            db.Article.create(results)
            .then(function (dbArticle) {
                // View the added result in the console
                articleCount++;
                console.log(articleCount);
            })
            .catch(function (err) {
                // If an error occurred, log it
                console.log(err);
            });
          });
        })
      }
      res.send("Scrape Complete");
    });
  })

  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function (req, res) {
    // TODO
    // ====
    // Finish the route so it finds one article using the req.params.id,
    // and run the populate method with "note",
    // then responds with the article with the note included
    db.Article.findOne({ _id: req.params.id })
      .populate("note")
      .then(dbArticle => {
        res.json(dbArticle);
      })
      .catch(err => {
        res.json(err);
      });
  });

  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function (req, res) {
    // TODO
    // ====
    // save the new note that gets posted to the Notes collection
    // then find an article from the req.params.id
    // and update it's "note" property with the _id of the new note
    db.Note.create(req.body)
      .then(dbNote => {
        return db.Article.findOneAndUpdate(
          { _id: req.params.id },
          { note: dbNote._id },
          { new: true });
      })
      .then(dbArticle => {
        res.json(dbArticle);
      })
      .catch(err => {
        res.json(err);
      });
  });
  // Update the saved status of the article based on article id
  app.put("/api/article/:id/saved", function (req, res) {
    let saved;
    if (req.body.saved === "true")
      saved = true;
    else if (req.body.saved === "false")
      saved = false;

    db.Article.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, { $set: { saved: saved } }).then(dbRes => {
      console.log(dbRes);
      if (dbRes.nModified === 0) {
        return res.status(404).json({
          "message": "Article not found",
          "articleId": req.params.id,
          "savedStatus": req.body.saved
        })
      }
      res.json({
        "message": "Article saved status updated",
        "articleId": req.params.id,
        "savedStatus": req.body.saved
      })
    }).catch(err => {
      res.status(500).json(err);
    });
  });

  // Delete a comment (aka Note) and remove the reference to its id from the Article collection's document
  app.delete("/api/comment/:id", function (req, res) {
    const articleId = req.body.articleId;
    const commentId = req.params.id;
    // First remove the full comment from the Note collection
    db.Note.remove({ _id: mongoose.Types.ObjectId(commentId) })
      .then(dbRes => {
        // Then remove it's object id reference from the document in the Article collection
        // Search by article id, then remove the note object id from the array
        db.Article.findById(articleId)
          .then(dbRes => {
            let notesArr = dbRes.notes;
            notesArr = notesArr.filter(note => note !== commentId);
            db.Article.update({ _id: mongoose.Types.ObjectId(articleId) }, { $set: { notes: notesArr } })
              .then(dbRes => {
                res.json({
                  "message": "Comment deleted from article",
                  "commentId": commentId,
                  "articleId": articleId
                })
              })
              .catch(err => {
                res.status(500).json(err);
              })
          })
          .catch(err => {
            res.status(500).json(err)
          })
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });

};
