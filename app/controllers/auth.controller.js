const client = require("../../index")
const { encrypt, decrypt, random } = require("../utils/crypto")
const tcwrapper = require("../utils/tcwrapper")

const auth = () => ({
	login(req, res) {
		tcwrapper(() => {
			const newAccessToken = random()
			const newRefreshToken = random()
			client.get(`user:${ req.body.username }`, (error, result) => {
				if (decrypt(result) === req.body.password) {
					client.set(`access_token:${ newAccessToken }:${ newRefreshToken }`, req.body.username)
					client.expire(`access_token:${ newAccessToken }:${ newRefreshToken }`, 3600)
					client.set(`refresh_token:${ newRefreshToken }:${ newAccessToken }`, req.body.username)
					client.expire(`refresh_token:${ newRefreshToken }:${ newAccessToken }`, 7200)
					res.set("Access-Token", `${ newAccessToken }:${ newRefreshToken }`)
					res.set("Refresh-Token", `${ newRefreshToken }:${ newAccessToken }`)
					res.send("success")
				} else res.send("wrong password")
			})
		})
	},
	refresh(req, res) {
		tcwrapper(() => {
			const headerRefreshToken = req.get("Refresh-Token")
			const newAccessToken = random()
			const newRefreshToken = random()
			const matchedAccessToken = 	headerRefreshToken.split(":").reverse().join(":")
			client.get(`access_token:${ headerRefreshToken }`, (error, result) => {
				client.set(`access_token:${ newAccessToken }:${ newRefreshToken }`, result)
				client.expire(`access_token:${ newAccessToken }:${ newRefreshToken }`, 3600)
				client.set(`refresh_token:${ newRefreshToken }: ${ newAccessToken }`, result)
				client.expire(`refresh_token:${ newRefreshToken }: ${ newAccessToken }`, 7200)
			})

			client.del(`access_token:${ matchedAccessToken }`)
			client.del(`refresh_token:${ headerRefreshToken }`)
			res.send("tokens have been refreshed")
		})
	},
	signOut(req, res) {
		tcwrapper(() => {
			const headerAccessToken = req.get("Access-Token")
			const matchedRefreshToken = headerAccessToken.split(":").reverse().join(":")
			client.del(`access_token:${ headerAccessToken }`)
			client.del(`refresh_token:${ matchedRefreshToken }`)
			res.send("successfully logged out")
		})
	},
	register(req, res) {
		tcwrapper(() => {
			client.set(`user:${ req.body.username }`, encrypt(req.body.password))
			res.send("registration completed successfully")
		})
	}
})

module.exports = {
	...auth()
}