const express = require('express');
const router = express.Router();

router.get('/profile', (req, res) => {
  const user = req.session.user;

  if (user) {
    res.render('profile', {
      UtilizadorID: user.UtilizadorID,
      nome: user.Nome,
      email: user.Email,
      isAdmin: user.isAdmin // Certifique-se de passar a propriedade isAdmin para o template
    });
  } else {
    res.redirect('/');
  }
});

module.exports = router;
