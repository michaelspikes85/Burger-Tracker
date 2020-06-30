var express = require("express");

var router = express.Router();

// Import the model (burger.js) to use its database functions.
var burger = require("../models/burger.js");


// Create all our routes and set up logic within those routes where required.
router.get("/", function(req, res) {
  burger.all(function(data) {
    var hbsObject = {
      burgers: data
    };
    console.log(hbsObject);
    res.render("index", hbsObject);
  });
});

router.post("/api/burgers", function(req, res) {
  var newBurger = {
    burger_name: req.body.burger_name,
    // devoured comes in as a string, and we need it to be a boolean
    devoured: JSON.parse(req.body.devoured.toLowerCase())
  };

  burger.create(newBurger, function(result) {
    // Send back the ID of the new quote
    res.json({ id: result.insertId });
  });
});

router.put("/api/burgers/:id", function(req, res) {
  var condition = { id: req.params.id };

  console.log("condition", condition);
  burger.update(
    {
      // devoured comes in as a strine, and we need it to be a boolean
      devoured: JSON.parse(req.body.devoured.toLowerCase())
    },
    condition,
    function(result) {
      if (result.changedRows === 0) {
        // If no rows were changed, then the ID must not exist, so 404
        return res.status(404).end();
      }
      res.status(204).end();

    }
  );
});

router.delete("/api/burgers/:id", function(req, res) {
  var condition = { id: req.params.id };

  burger.delete(condition, function(result) {
    if (result.affectedRows == 0) {
      // If no rows were changed, then the ID must not exist, so 404
      return res.status(404).end();
    } else {
      res.status(204).end();
    }
  });
});

// Export routes for server.js to use.
module.exports = router;
