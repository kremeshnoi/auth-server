const Redis = require("ioredis");
const redis = new Redis();
const { encrypt, decrypt, random } = require("../utils/crypto");
const tcwrapper = require("../utils/tcwrapper");

const auth = () => ({
	login(req, res) {
		tcwrapper(() => {
			const new_access_token = random();
			const new_refresh_token = random();
			redis.get(`user:${ req.body.username }`, (error, result) => {
				if (decrypt(result) === req.body.password) {
					redis.set(`access_token:${ new_access_token }:${ new_refresh_token }`, req.body.username);
					redis.expire(`access_token:${ new_access_token }:${ new_refresh_token }`, 3600);
					redis.set(`refresh_token:${ new_refresh_token }:${ new_access_token }`, req.body.username);
					redis.expire(`refresh_token:${ new_refresh_token }:${ new_access_token }`, 7200);
					res.set("Access-Token", `${ new_access_token }:${ new_refresh_token }`);
					res.set("Refresh-Token", `${ new_refresh_token }:${ new_access_token }`);
					res.send("success");
				} else res.send("wrong password");
			});
		});
	},
	refresh(req, res) {
		tcwrapper(() => {
			const header_refresh_token = req.get("Refresh-Token");
			const new_access_token = random();
			const new_refresh_token = random();
			const matched_access_token = 	header_refresh_token.split(":").reverse().join(":");
			redis.get(`access_token:${ header_refresh_token }`, (error, result) => {
				redis.set(`access_token:${ new_access_token }:${ new_refresh_token }`, result)
				redis.expire(`access_token:${ new_access_token }:${ new_refresh_token }`, 3600);
				redis.set(`refresh_token:${ new_refresh_token }: ${ new_access_token }`, result)
				redis.expire(`refresh_token:${ new_refresh_token }: ${ new_access_token }`, 7200);
			});

			redis.del(`access_token:${ matched_access_token }`);
			redis.del(`refresh_token:${ header_refresh_token }`);
			res.send("tokens have been refreshed");
		});
	},
	sign_out(req, res) {
		tcwrapper(() => {
			const header_access_token = req.get("Access-Token");
			const matched_refresh_token = header_access_token.split(":").reverse().join(":");
			redis.del(`access_token:${ header_access_token }`);
			redis.del(`refresh_token:${ matched_refresh_token }`);
			res.send("successfully logged out");
		});
	},
	register(req, res) {
		tcwrapper(() => {
			redis.set(`user:${ req.body.username }`, encrypt(req.body.password));
			res.send("registration completed successfully");
		});
	}
});

module.exports = {
	...auth()
};