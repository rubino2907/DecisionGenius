const express = require('express');
const router = express.Router();

router.get('/verSeries', (req, res) => {
  const user = req.session.user;

  if (user && user.isAdmin === 1) {
    res.render('seeSeries', {
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