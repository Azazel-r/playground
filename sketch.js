let triangs
const N = 5
const impactRadius = 200
const fact = 75
let resetting = false
let resetPos = []
let resetRot = []
let startPos = []
const resetFrames = 120
let frameAtReset

function setup() {
	new Canvas(window.innerWidth, window.innerHeight);
	displayMode('centered');
	let lines = [new Sprite(0, height/2, [height, 90]), new Sprite(width, height/2, [height, 90]), new Sprite(width/2, 0, [width, 0]), new Sprite(width/2, height, [width, 0])]
	for (let i = 0; i < lines.length; ++i) { lines[i].static = true; lines[i].strokeColor = 0; }
	triangs = getSierpTriangs(width/2, 3*height/5, 600, N)
	setup_()
}

function setup_() {
	resetPos = []
	resetRot = []
	startPos = []
	for (let i = 0; i < triangs.length; ++i) {
		triangs[i].fill = 255
		triangs[i].stroke = 255
		triangs[i].static = true
		triangs[i].rotationLock = false
		triangs[i].rotationDrag = 0
		startPos.push(triangs[i].pos.x)
		startPos.push(triangs[i].pos.y)
	}
}

function draw() {
	background(0)

	if (resetting) {
		let t = 1.0 * (frameCount-1-frameAtReset) / resetFrames
		if (t >= 1.0) {
			resetting = false
			setup_()
		} else {
			for (let i = 0; i < triangs.length; ++i) {
				let x =   map(resetAnim(t), 0, 1, resetPos[2*i],   startPos[2*i])
				let y =   map(resetAnim(t), 0, 1, resetPos[2*i+1], startPos[2*i+1])
				let rot = map(resetAnim(t), 0, 1, resetRot[i],     0)
				triangs[i].rotationLock = true
				triangs[i].static = true
				triangs[i].rotation = rot
				triangs[i].pos.x = x
				triangs[i].pos.y = y
				if (t == 0) console.log(x, y)
			}
		}
	}

	else if (keyboard.presses()) {
		for (let i = 0; i < triangs.length; ++i) {
			//console.log(triangs[i].pos.x, triangs[i].pos.y)
		}
		reset()
		console.log(resetPos)
	}

	else if (mouse.presses()) {
		for (let i = 0; i < triangs.length; ++i) {
			triangs[i].static = false
			const x = triangs[i].pos.x
			const y = triangs[i].pos.y
			const vectorLength = dist(mouseX, mouseY, x, y)
			const diff = easeOutSine(constrain(map(vectorLength, 0, impactRadius, 1, 0), 0, 1))
			//if (diff > 0) console.log(i)
			triangs[i].applyForce(fact*diff*(x-mouseX)/vectorLength, fact*diff*(y-mouseY)/vectorLength)//, {mouseX, mouseY})
		}
	}
}

function makeTriang(x, y, d) {
	let p1 = [x - d/2, y + (d/2 * Math.sqrt(3) - d * Math.sin(Math.PI / 6) / Math.sin(2 * Math.PI / 3))]
	let p2 = [x + d/2, y + (d/2 * Math.sqrt(3) - d * Math.sin(Math.PI / 6) / Math.sin(2 * Math.PI / 3))]
	let p3 = [x,       y - (d * Math.sin(Math.PI / 6) / Math.sin(2 * Math.PI / 3))]
	return new Sprite([p1, p2, p3, p1])
}

function reset() {
	if (!resetting) {
		resetting = true
		for (let i = 0; i < triangs.length; ++i) {
			console.log("X:", startPos[2*i], triangs[i].pos.x, "Y:", startPos[2*i+1], triangs[i].pos.y)
			resetPos.push(triangs[i].pos.x)
			resetPos.push(triangs[i].pos.y)
			resetRot.push(triangs[i].rotation)
		}
		frameAtReset = frameCount
	}
}

function getSierpTriangs(x, y, d, n) {

	if (n == 0) {
		return [makeTriang(x,y,d)]
	}
	let erg = []
	let erg1 = getSierpTriangs(x - d/4, y + (d/4 * Math.sqrt(3) - d/2 * Math.sin(Math.PI / 6) / Math.sin(2 * Math.PI / 3)), d/2, n-1)
	let erg2 = getSierpTriangs(x + d/4, y + (d/4 * Math.sqrt(3) - d/2 * Math.sin(Math.PI / 6) / Math.sin(2 * Math.PI / 3)), d/2, n-1)
	let erg3 = getSierpTriangs(x,       y - (d/2 * Math.sin(Math.PI / 6) / Math.sin(2 * Math.PI / 3)), d/2, n-1)

	for (let i = 0; i < erg1.length; ++i) {
		erg.push(erg1[i])
		erg.push(erg2[i])
		erg.push(erg3[i])
	}

	return erg

}

function easeOutSine(p) {
	return Math.sin(0.5 * Math.PI * p)
}

function resetAnim (p) {
	return -0.5 * Math.cos(Math.PI * p) + 0.5 
}