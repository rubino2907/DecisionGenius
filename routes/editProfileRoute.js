const express = require('express');
const router = express.Router();

// Rota '/editProfile' também pode ser ajustada da mesma forma
router.get('/editProfile', (req, res) => {
  const user = req.session.user;

  if (user) {
    res.render('editProfile', {
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
