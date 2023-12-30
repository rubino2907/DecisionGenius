const express = require('express');
const router = express.Router();

router.get('/jogoForca', (req, res) => {
  const user = req.session.user;

  if (user && user.isAdmin === 1) {
    res.render('jogoForca', {
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