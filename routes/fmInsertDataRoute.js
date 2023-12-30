const express = require('express');
const router = express.Router();

router.get('/fmInsertData', (req, res) => {
  const user = req.session.user;

  if (user) {
    res.render('fmInsertData', {
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
