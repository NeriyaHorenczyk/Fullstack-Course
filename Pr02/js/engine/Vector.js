// @ts-check

export default class Vector {
	/**
	 * @param {number} x
	 * @param {number} y
	 */
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	/**
	 * Adds another vector to this vector.
	 * @param {Vector} other
	 * @returns {Vector} The resulting vector.
	 */
	add(other) {
		return new Vector(this.x + other.x, this.y + other.y);
	}

	/**
	 * Subtracts another vector from this vector.
	 * @param {Vector} other
	 * @returns {Vector} The resulting vector.
	 */
	subtract(other) {
		return new Vector(this.x - other.x, this.y - other.y);
	}

	/**
	 * Scales this vector by a scalar.
	 * @param {number} scalar
	 * @returns {Vector} The resulting vector.
	 */
	scale(scalar) {
		return new Vector(this.x * scalar, this.y * scalar);
	}

	/**
	 * Calculates the dot product with another vector.
	 * @param {Vector} other
	 * @returns {number} The dot product.
	 */
	dot(other) {
		return this.x * other.x + this.y * other.y;
	}

	/**
	 * Calculates the magnitude (length) of the vector.
	 * @returns {number} The magnitude.
	 */
	magnitude() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	/**
	 * Normalizes the vector (makes it unit length).
	 * @returns {Vector} The normalized vector.
	 */
	normalize() {
		const mag = this.magnitude();
		if (mag === 0) return new Vector(0, 0);
		return this.scale(1 / mag);
	}
}
