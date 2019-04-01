// eslint-disable-next-line no-undef
importScripts("./libs/jimp.min.js");

// eslint-disable-next-line no-undef
var targetMime = Jimp.MIME_JPEG;

function resizeImage(imageSrc, width, height, quality, cb) {

    var filenameParts = imageSrc.split(".");

    if (filenameParts[filenameParts.length - 1].toLowerCase() === "png") {
        // eslint-disable-next-line no-undef
        targetMime = Jimp.MIME_PNG;
    }
    // eslint-disable-next-line no-undef
    Jimp.read(imageSrc, function (err, img) {

        if (err) throw err;

        img.resize(width, height)
            .quality(quality)
            .getBuffer(targetMime, function (mime, data) {

                var dataUri = "data:" + targetMime + ";base64," + data.toString("base64");

                cb(dataUri);
            });
    });
}

self.addEventListener("message", function (message) {

    try {
        resizeImage(message.data.src, message.data.width, message.data.height, message.data.quality, function (dataUri) {
            self.postMessage({
                "dataUri": dataUri,
                "src": message.data.src
            });
        });
    } catch (e) {
        self.postMessage({
            err: e
        });
    }

});
