const mongoose = require("mongoose");

mongoose.model("User", require("./User"));
mongoose.model("Post", require("./Post"));
mongoose.model("Comment", require("./Comment"));
mongoose.model("Relationship", require("./Relationship"));
