const express = require('express');
const router = express.Router();

router.get('/filmes', (req, res) => {
  const user = req.session.user;

  if (user) {
    res.render('filmes', {
      UtilizadorID: user.UtilizadorID,
      nome: user.Nome,
      email: user.Email,
      isAdmin: user.isAdmin
    });
  } else {
    res.redirect('/');
  }
});

module.exports = router;
