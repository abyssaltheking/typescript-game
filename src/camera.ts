import { HelperMath } from "./helperMath";

export class Camera {
    public position: { x: number, y: number };
    public velocity: { x: number, y: number };
    public terminalVelocity: { minimum: number, maximum: number };
    public freezeMovementIn: {
        up: boolean,
        down: boolean,
        left: boolean,
        right: boolean
    }
    
    constructor(
        position: { x: number, y: number}, 
        terminalVelocity: { minimum: number, maximum: number }) 
    {
        this.position = position;
        this.velocity = { x: 0, y: 0 };
        this.terminalVelocity = terminalVelocity;
        this.freezeMovementIn = {
            up: false,
            down: false,
            left: false,
            right: false
        }
    }

    updatePosition(damping: number) {
        this.velocity.x = HelperMath.clamp(this.velocity.x, this.terminalVelocity.minimum, this.terminalVelocity.maximum);
        this.velocity.y = HelperMath.clamp(this.velocity.y, this.terminalVelocity.minimum, this.terminalVelocity.maximum);

        if (this.freezeMovementIn.left && this.velocity.x > 0) this.velocity.x = 0;
        if (this.freezeMovementIn.right && this.velocity.x < 0) this.velocity.x = 0;
        if (this.freezeMovementIn.up && this.velocity.x < 0) this.velocity.x = 0;
        if (this.freezeMovementIn.down && this.velocity.x > 0) this.velocity.x = 0;

        if (this.velocity.x > 0) this.velocity.x -= damping;
        if (this.velocity.x < 0) this.velocity.x += damping;
        if (Math.abs(this.velocity.x) < damping) this.velocity.x = 0;

        if (this.velocity.y > 0) this.velocity.y -= damping;
        if (this.velocity.y < 0) this.velocity.y += damping;
        if (Math.abs(this.velocity.y) < damping) this.velocity.y = 0;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}