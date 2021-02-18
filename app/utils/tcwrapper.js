const tcwrapper = function(f) {
	try {
		return f.apply(this, arguments);
	} catch(error) {
		res.status(400).send(error.message);
	}
};

module.exports = tcwrapper;