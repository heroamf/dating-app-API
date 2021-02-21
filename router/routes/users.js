var mongoose = require("mongoose"),
  router = require("express").Router(),
  User = mongoose.model("User"),
  auth = require("../auth");

router.get("/user", auth.required, function (req, res, next) {
  User.findById(req.payload.id)
    .then((user) => {
      if (!user) {
        return res.sendStatus(401); // não autorizado
      }
      return res.json({ user: user.toAuthJSON() });
    })
    .catch(next);
});

router.put("/user", auth.required, function (req, res, next) {
  User.findById(req.payload.id)
    .then((user) => {
      if (!user) {
        return res.sendStatus(401); // não autorizado
      }
      //check para alterar apenas campos que foram passados na req
      //lembrete:
      //achar uma forma de automatizar e diminuir código

      if (typeof req.body.user.username !== "undefined") {
        user.username = req.body.user.username;
      }

      if (typeof req.body.user.email !== "undefined") {
        user.email = req.body.user.email;
      }

      if (typeof req.body.user.bio !== "undefined") {
        user.bio = req.body.user.bio;
      }

      if (typeof req.body.user.password !== "undefined") {
        user.password = req.body.user.password; //precisa de método para criptografia
      }

      return user.save().then(() => {
        return res.json({ user: user.toAuthJSON() });
      });
    })
    .catch(next);
});

router.post("/users", function (req, res, next) {
  var user = new User();

  user.username = req.body.user.username;
  user.email = req.body.user.email;
  user.password = req.body.user.password; //precisa de método para criptografia

  user
    .save()
    .then(() => {
      return res.json({ user: user.toAuthJSON() });
    })
    .catch(next);
});

module.exports = router;
