var ghpages = require("gh-pages");

ghpages.publish("dist", function (err) {
  if (err) new Error(err);

  console.log("Published to gh-pages!!! :)");
});
