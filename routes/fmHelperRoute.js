const express = require('express');
const router = express.Router();

router.get('/fmHelper', (req, res) => {
  const user = req.session.user;

  if (user) {
    res.render('fmHelper', {
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
