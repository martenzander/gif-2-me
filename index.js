// Load in our dependencies
const pngFileStream = require("png-file-stream");
const GifEncoder = require("gifencoder");
const fs = require("fs");
const path = require("path");
const settings = require("./settings.js");
const sizeOf = require("image-size");
const gm = require("gm").subClass({ imageMagick: true });

let motive = [];
let outputPath;
let width;
let height;

function init() {
	if (!fs.existsSync(settings.outputPath)) {
		fs.mkdirSync(settings.outputPath);
	}

	fs.readdir(settings.targetPath, (err, data) => {
		motive = data;
		createGif(0);
	});
}

function setImageDimensions(motiv, callback) {
	fs.readdir(path.join(settings.targetPath, motiv), (err, data) => {
		const size = sizeOf(path.join(settings.targetPath, motiv, "processed", data[data.length - 1]));
		width = size.width;
		height = size.height;

		callback();
	});
}

function createGif(i) {
	if (i > motive.length - 1) return;
	const motiv = motive[i];

	if (motiv.indexOf(".DS_Store") >= 0) {
		createGif(i + 1);
	} else {
		console.log(`start: ${motiv}`);
		setImageDimensions(motiv, e => {
			const gif = new GifEncoder(width, height);
			gif.setDelay(1000 / settings.fps);
			gif.setQuality(1);
			gif.setTransparent(settings.transparencyColor);
			const stream = pngFileStream(path.join(settings.targetPath, motiv, "processed", "*.png"))
				.pipe(gif.createWriteStream({}))
				.pipe(fs.createWriteStream(path.join(settings.outputPath, `${motiv}.gif`)));
			stream.on("finish", function() {
				console.log(`done: ${motiv}`);
				createGif(i + 1);
			});
		});
	}
}

init();
