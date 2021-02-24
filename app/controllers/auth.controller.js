const client = require("../../index")
const { encrypt, decrypt, random } = require("../utils/crypto");
const tcwrapper = require("../utils/tcwrapper");

const auth = () => ({
	login(req, res) {
		tcwrapper(() => {
			const new_access_token = random();
			const new_refresh_token = random();
			client.get(`user:${ req.body.username }`, (error, result) => {
				if (decrypt(result) === req.body.password) {
					client.set(`access_token:${ new_access_token }:${ new_refresh_token }`, req.body.username);
					client.expire(`access_token:${ new_access_token }:${ new_refresh_token }`, 3600);
					client.set(`refresh_token:${ new_refresh_token }:${ new_access_token }`, req.body.username);
					client.expire(`refresh_token:${ new_refresh_token }:${ new_access_token }`, 7200);
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
			client.get(`access_token:${ header_refresh_token }`, (error, result) => {
				client.set(`access_token:${ new_access_token }:${ new_refresh_token }`, result)
				client.expire(`access_token:${ new_access_token }:${ new_refresh_token }`, 3600);
				client.set(`refresh_token:${ new_refresh_token }: ${ new_access_token }`, result)
				client.expire(`refresh_token:${ new_refresh_token }: ${ new_access_token }`, 7200);
			});

			client.del(`access_token:${ matched_access_token }`);
			client.del(`refresh_token:${ header_refresh_token }`);
			res.send("tokens have been refreshed");
		});
	},
	sign_out(req, res) {
		tcwrapper(() => {
			const header_access_token = req.get("Access-Token");
			const matched_refresh_token = header_access_token.split(":").reverse().join(":");
			client.del(`access_token:${ header_access_token }`);
			client.del(`refresh_token:${ matched_refresh_token }`);
			res.send("successfully logged out");
		});
	},
	register(req, res) {
		tcwrapper(() => {
			client.set(`user:${ req.body.username }`, encrypt(req.body.password));
			res.send("registration completed successfully");
		});
	}
});

module.exports = {
	...auth()
};