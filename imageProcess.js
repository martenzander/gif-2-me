// Load in our dependencies
const fs = require("fs");
const path = require("path");
const settings = require("./settings.js");
const sizeOf = require("image-size");
const gm = require("gm").subClass({ imageMagick: true });

let motive = [];
let files = [];
let width;
let height;
let outputPath;

function init() {
	fs.readdir(settings.targetPath, (err, data) => {
		motive = data;

		const index = motive.indexOf(".DS_Store");
		if (index > -1) motive.splice(index, 1);

		processMotive(0);
	});
}

function setImageDimensions(image) {
	const size = sizeOf(image);
	width = size.width;
	height = size.height;
}

function processMotive(i) {
	if (i > motive.length - 1) return;

	const motiv = motive[i];

	if (!fs.existsSync(path.join(settings.targetPath, motiv, "processed"))) {
		fs.mkdirSync(path.join(settings.targetPath, motiv, "processed"));
	}

	fs.readdir(path.join(settings.targetPath, motiv), (err, data) => {
		files = data;
		const index = files.indexOf(".DS_Store");
		if (index > -1) files.splice(index, 1);

		processFile(motiv, 0, e => {
			processMotive(i + 1);
		});
	});
}

function processFile(motiv, i, callback) {
	if (i > files.length - 1) {
		callback();
	} else {
		const file = files[i];
		if (file.indexOf("processed") >= 0 || file.indexOf(".DS_Store") >= 0) {
			processFile(motiv, i + 1, callback);
		} else {
			console.log(`start: ${file}`);
			setImageDimensions(path.join(settings.targetPath, motiv, file));

			const imageProcess = gm(path.join(settings.targetPath, motiv, file));
			imageProcess.rotate(settings.transparencyColor, settings.rotate);
			imageProcess.crop(
				width - settings.crop.right - settings.crop.left,
				height - settings.crop.bottom - settings.crop.top,
				settings.crop.left,
				settings.crop.top
			);
			imageProcess.resize(100 * settings.scale, 100 * settings.scale, "%");
			if (settings.trim) imageProcess.trim();
			imageProcess.write(path.join(settings.targetPath, motiv, "processed", file), function(err) {
				if (!err) {
					console.log(`done: ${file}`);
					processFile(motiv, i + 1, callback);
				}
			});
		}
	}
}

init();
