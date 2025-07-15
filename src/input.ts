export let keysDown: object = {};
export let keysReleased: object = {};
export let deltaTime: number = 1 / 60;

// tbh all these ts-ignores make me cringe bc of just the sheer number of them
// but i really dont know any better solutions so that the TS compiler will shut the fuck up about things that work

export function isKeyDown(key: string): boolean {
	// @ts-ignore
	return keysDown[key];
}

export function wasKeyReleased(key: string) {
	// @ts-ignore
	return keysReleased[key];
}

export function setDeltaTime(delta: number) {
	deltaTime = delta;
}

function releaseKey(key: string) {
	// @ts-ignore
	delete keysDown[event.key];

	// @ts-ignore
	keysReleased[key] = true;

	setTimeout(() => {
		// @ts-ignore
		delete keysReleased[key];
	}, deltaTime);
}

document.addEventListener("keydown", (event) => {
	// @ts-ignore
	keysDown[event.key] = true;
});

document.addEventListener("keyup", (event) => {
	// @ts-ignore
	releaseKey(event.key);
});
