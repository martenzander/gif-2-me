const path = require("path");

module.exports = {
	targetPath: path.join(__dirname, "people-sticker/20190925/pngs/1"),
	outputPath: path.join(__dirname, "people-sticker/20190925/gifs/1"),
	transparencyColor: "0x000000",
	rotate: 0,
	fps: 30,
	crop: {
		top: 60,
		right: 520,
		bottom: 0,
		left: 520
	},
	scale: 0.5,
	trim: false
};
