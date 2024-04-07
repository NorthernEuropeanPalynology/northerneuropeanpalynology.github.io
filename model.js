/**
 * class Model
 * Loads the Tensorflow model and preprocesses and predicts images
 */
class Model {
	/**
	 * Initializes the Model class, loads and warms up the model, etc
	 */
	constructor() {

		this.categories = ["Apiaceae", "Artemisia", "Artemisia", "Betula", "Betula", "Chenopodiaceae", "Cyperaceae", "Helianthemum", "Lycopodium", "Lycopodium", "NPP_CLASS1", "NPP_CLASS2", "NPP_CLASS3", "NPP_CLASS4", "Pinus", "Poaceae", "Poaceae", "Salix"];
		this.isWarmedUp = this.loadModel()
			.then(this.warmUp.bind(this))
			.then(() => console.info("Backend running on:", tf.getBackend()))
	}

	/**
	 * Loads the model
	 */
	loadModel() {
		console.time("Load model")
		return tf.loadGraphModel("model/model.json").then(model => {
			this._model = model;
			console.timeEnd("Load model")
		})
	}

	/**
	 * Runs a prediction with random data to warm up the GPU
	 */
	warmUp() {
		console.time("Warmup")
		this._model.predict(tf.randomNormal([1,140,140,3])).as1D().dataSync()
		this.isWarmedUp = true;
		console.timeEnd("Warmup")
	}

	/**
	 * Takes an ImageData object and reshapes it to fit the model
	 * @param {ImageData} InputImage
	 */
	preprocessImage(InputImage) {

		const targetDim = 140;

		let	tempImg = null;

		// remove the previous image to avoid memory leak
		if(tempImg) tempImg.dispose();

		return tf.tidy(() => {
			// convert the pixel data into a tensor with 1 data channel per pixel
			// i.e. from [h, w, 4] to [h, w, 1]
			let tensor = tf.browser.fromPixels(InputImage, 3)
			// scale it down
			tensor = tf.image.resizeBilinear(tensor, [targetDim, targetDim])
			// invert and normalize to match training data
			tensor = tf.scalar(1.0).sub(tensor.toFloat().div(tf.scalar(255.0)))

			// display what the model will see (keeping the tensor outside the tf.tidy scope is necessary)
			tempImg = tf.keep(tf.clone(tensor))
			// Reshape again to fit training model [N, 28, 28, 1]
			// where N = 1 in this case
			return tensor.expandDims(0)
		});
	}

	/**
	 * Takes an ImageData objects and predict a category
	 * @param {ImageData} InputImage
	 * @returns {string} category
	 */
	predict(InputImage) {

		if(!this._model) return console.warn("Model not loaded yet!");
		console.time("Prediction")
		let tensor = this.preprocessImage(InputImage),
			prediction = this._model.predict(tensor).as1D(),
			// get the index of the most probable category
			argMax = prediction.argMax().dataSync()[0],
			probability = prediction.max().dataSync()[0],
			// get the character at that index
			category = this.categories[argMax];

		console.log("Predicted", category, "Probability", probability)
		console.timeEnd("Prediction")
		return [category, probability]
	}
}

