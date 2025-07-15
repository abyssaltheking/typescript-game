export class HelperMath {
    static clamp(value: number, minimumOutput: number, maximumOutput: number): number {
        let newOutput = value;

        if (value < minimumOutput) newOutput = minimumOutput;
        if (value > maximumOutput) newOutput = maximumOutput;
    
        return newOutput;
    }

    static isValueInRange(value: number, minimum: number, maximum: number): boolean {
        return minimum <= value && value <= maximum;
    }

    static getRandomNumber(minimum: number, maximum: number): number {
        return HelperMath.clamp(Math.random() * maximum, minimum, maximum);
    }

    static degreesToRadians(value: number): number {
        return value * Math.PI / 180;
    }
}
