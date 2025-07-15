import { Application, Assets, Container, Sprite, Text } from "pixi.js";
import { sound } from "@pixi/sound";
import { Camera } from "./camera";
import { isKeyDown, setDeltaTime, wasKeyReleased } from "./input";
import { HelperMath } from "./helperMath";

(async () => {
	const app = new Application();
	const camera = new Camera({ x: 0, y: 0 }, { minimum: -8, maximum: 8 });
	const game = new Container();
	const texture = await Assets.load("/assets/bunny.png");
	await Assets.load({ alias: "JetBrainsMono", src: "JetBrainsMono.ttf" });

	sound.add("click", "click.mp3");

	const bunnies: Array<Sprite> = [];

	for (let i = 0; i < 99; i++) {
		bunnies.push(new Sprite(texture));
	}

	const fpsText = new Text({
		text: "FPS: -1",
		style: {
			fontFamily: "JetBrainsMono",
			fontSize: 14,
			fill: "#ffffff",
		},
	});

	const scoreText = new Text({
		text: "Score",
		style: {
			fontFamily: "JetBrainsMono",
			fontSize: 30,
			fill: "#ffffff",
		},
	});

	const comboText = new Text({
		text: "2x COMBO",
		style: {
			fontFamily: "JetBrainsMono",
			fontSize: 25,
			fill: "#ffff00",
		},
	});

	let score = 0;

	let combo = {
		multiplier: 1,
		size: 0,
	};

	fpsText.position = { x: 10, y: 10 };

	scoreText.anchor.set(0.5);
	scoreText.position = { x: innerWidth / 2, y: 200 };

	comboText.anchor.set(0.5);
	comboText.position = { x: innerWidth / 2 + 90, y: 235 };
	comboText.rotation = HelperMath.degreesToRadians(-5);
	comboText.visible = false;

	// @ts-ignore this is so the pixijs extension will work
	globalThis.__PIXI_APP__ = app;

	await app.init({
		background: "#333333",
		resizeTo: window,
		preference: "webgl",
		preferWebGLVersion: 2,
	});

	document.getElementById("pixi-container")!.appendChild(app.canvas);

	bunnies.forEach((bunny) => {
		game.addChild(bunny);
		bunny.anchor.set(0.5);
		bunny.position.x = HelperMath.getRandomNumber(0, 5000) - 2500;
		bunny.position.y = HelperMath.getRandomNumber(0, 5000) - 2500;
		bunny.cullable = true;
		bunny.eventMode = "static";

		bunny.on("pointerdown", () => {
			sound.play("click");
			score += 1 * combo.multiplier;
			combo.size++;

			bunny.position.x = HelperMath.getRandomNumber(0, 5000) - 2500;
			bunny.position.y = HelperMath.getRandomNumber(0, 5000) - 2500;
		});
	});

	app.stage.addChild(game);
	app.stage.addChild(fpsText);
	app.stage.addChild(scoreText);
	app.stage.addChild(comboText);

	let comboTimer = 0;

	app.ticker.add((time) => {
		let deltaSeconds = time.deltaMS / 1000;
		setDeltaTime(time.deltaMS);

		comboTimer += deltaSeconds;

		if (combo.size >= 3) {
			combo.multiplier += 1;
			combo.size = 0;
			comboTimer = 0;
		}

		if (comboTimer >= 4) {
			combo.multiplier = 1;
			combo.size = 0;
			comboTimer = 0;
		}

		camera.updatePosition(0.25);

		if (isKeyDown("d")) camera.velocity.x -= 0.5 * time.deltaTime;
		if (isKeyDown("a")) camera.velocity.x += 0.5 * time.deltaTime;
		if (isKeyDown("w")) camera.velocity.y += 0.5 * time.deltaTime;
		if (isKeyDown("s")) camera.velocity.y -= 0.5 * time.deltaTime;

		if (camera.position.x < -2500) {
			camera.position.x = -2500;
		}

		if (camera.position.x > 2500 + innerWidth) camera.position.x = 2500;

		console.log(camera.position, camera.velocity);

		game.children.forEach((child) => {
			child.position.x = child.position.x + camera.velocity.x;
			child.position.y = child.position.y + camera.velocity.y;
		});

		if (wasKeyReleased("r")) {
			bunnies.forEach((bunny) => {
				bunny.position.x = HelperMath.getRandomNumber(0, 5000) - 2500;
				bunny.position.y = HelperMath.getRandomNumber(0, 5000) - 2500;
			});
		}

		fpsText.text = "FPS: " + Math.round(time.FPS).toString();
		scoreText.text = "Score: " + Math.round(score).toString();
		comboText.text = `${combo.multiplier}x COMBO`;
		comboText.visible = combo.multiplier >= 2 ? true : false;
	});
})();
