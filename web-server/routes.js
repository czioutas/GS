module.exports = function(app, passport) {
  app.get('/', function(req, res) { res.render('index.ejs', { title: 'GS' }); });

};
// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.send(401);
}
