/**
 * RetroAvatarGenerator
 * Version: 0.1-beta
 *
 * Author: Lyès
 * Github: @lyes2k
 * 
 * This class generates retro-style pixel avatars based on a unique ID.
 * It supports customizable sizes, rounded corners, and different pixel densities.
 * The avatars are drawn on high-resolution canvases for supersampling, allowing the browser to resize them for display.
 */
class RetroAvatarGenerator {
    /**
     * Constructor
     * 
     * Initializes the avatar generation process by calling the init() method.
     */
    constructor() {
        this.init();
    }

    /**
     * Initializes the avatar generation process.
     * 
     * Selects all elements with the class "retro-avatar" and replaces each with a high-resolution canvas element.
     * The canvas is drawn with a retro-style avatar based on the data attributes provided.
     */
    init() {
        document.querySelectorAll('.retro-avatar').forEach(span => {
            const id = span.getAttribute('data-retro-id'); // Unique ID for the avatar
            const size = parseInt(span.getAttribute('data-retro-size'), 10) || 32; // Default size is 32 if not specified
            const roundType = span.getAttribute('data-round'); // Determine if the avatar should be rounded
            const density = parseInt(span.getAttribute('data-density'), 10) || 1; // Default density is 1

            // Create a high-resolution canvas for supersampling (e.g., 4x the original size)
            const scaleFactor = 4;
            const canvas = document.createElement('canvas');
            canvas.width = size * scaleFactor;
            canvas.height = size * scaleFactor;

            const ctx = canvas.getContext('2d');

            // Draw the avatar at the higher resolution
            this.drawRetroAvatar(id, size * scaleFactor, ctx, density);

            // Set the canvas display size to the intended size (browser will resize smoothly)
            canvas.style.width = `${size}px`;
            canvas.style.height = `${size}px`;

            // Apply the border radius to the display canvas if needed
            canvas.classList.add(...span.classList);
            if (roundType === '1') {
                canvas.style.borderRadius = '50%'; // Circular border
            } else if (roundType === '2') {
                canvas.style.borderRadius = '.25rem'; // Rounded corners
            }

            // Replace the span element with the high-resolution canvas
            span.parentNode.replaceChild(canvas, span);
        });
    }

    /**
     * Converts a given ID string into a numeric seed.
     * 
     * The seed is used to generate a unique avatar by seeding the randomization process.
     * 
     * @param {string} id - The unique identifier string.
     * @returns {number} - A numeric seed derived from the ID.
     */
    idToSeed(id) {
        let seed = 0;
        for (let i = 0; i < id.length; i++) {
            seed = id.charCodeAt(i) + ((seed << 5) - seed);
        }
        return seed;
    }

    /**
     * Selects a random color from the provided color palette based on the seed.
     * 
     * @param {number} seed - The numeric seed used to select the color.
     * @param {string[]} patternColors - The array of color hex codes to choose from.
     * @returns {string} - The selected color in hex format.
     */
    randomizeColor(seed, patternColors) {
        const index = Math.abs(seed) % patternColors.length;
        return patternColors[index];
    }

    /**
     * Retrieves a light color for the avatar.
     * 
     * This method selects a color from a predefined palette of light colors, ensuring the avatar is visually distinct.
     * 
     * @param {number} seed - The numeric seed used to select the color.
     * @returns {string} - The selected light color.
     */
    getLightColor(seed) {
        const avatarColors = [
            "#9763f8", "#e5739f", "#bbf5ec", "#5df0ab", "#4ac6e3",
            "#ff6b6b", "#ffb84d", "#8fa3ae", "#f490b1", "#aed581",
            "#f9e180", "#84b84c", "#4b4b6c", "#d9d9d9"
        ];

        return this.randomizeColor(seed, avatarColors);
    }

    /**
     * Retrieves a darker, vibrant color for the background.
     * 
     * This method selects a color from a predefined palette of darker colors, ensuring sufficient contrast with the avatar.
     * 
     * @param {number} seed - The numeric seed used to select the color.
     * @returns {string} - The selected darker vibrant color.
     */
    getDarkerVibrantColor(seed) {
        const backgroundColors = [
            "#401354", "#404c29", "#625a01", "#59282a", "#4e6a03",
            "#8fa3ae", "#f490b1", "#aed581", "#ff6b6b", "#ffb84d",
            "#4b4b6c", "#84b84c", "#d9d9d9", "#f9e180"
        ];

        return this.randomizeColor(seed, backgroundColors);
    }

    /**
     * Generates distinct colors for the avatar and background, ensuring sufficient contrast.
     * 
     * This method repeatedly attempts to find a pair of colors with a contrast ratio that meets accessibility standards.
     * 
     * @param {number} seed - The numeric seed used to select the colors.
     * @returns {[string, string]} - An array containing the avatar color and background color.
     */
    getAvatarAndBackgroundColors(seed) {
        const maxAttempts = 5;
        let avatarColor = this.getLightColor(seed);
        let backgroundColor = this.getDarkerVibrantColor(seed);

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            if (this.isContrastSufficient(avatarColor, backgroundColor)) {
                break;
            } else {
                avatarColor = this.getLightColor(seed + attempt + 1);
                backgroundColor = this.getDarkerVibrantColor(seed + attempt + 2);
            }
        }

        return [avatarColor, backgroundColor];
    }

    /**
     * Checks if the contrast between two colors is sufficient.
     * 
     * This method calculates the contrast ratio between two colors and ensures it meets the minimum standard for readability.
     * 
     * @param {string} color1 - The first color in hex format.
     * @param {string} color2 - The second color in hex format.
     * @returns {boolean} - True if the contrast is sufficient, false otherwise.
     */
    isContrastSufficient(color1, color2) {
        const luminance1 = this.getLuminance(color1);
        const luminance2 = this.getLuminance(color2);
        const contrast = (Math.max(luminance1, luminance2) + 0.05) / (Math.min(luminance1, luminance2) + 0.05);
        return contrast > 3; // Ensure contrast ratio is above 3:1
    }

    /**
     * Calculates the luminance of a color.
     * 
     * Luminance is a measure of the brightness of a color, which is used to calculate contrast ratios.
     * 
     * @param {string} color - The color in hex format.
     * @returns {number} - The calculated luminance value.
     */
    getLuminance(color) {
        const rgb = parseInt(color.slice(1), 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = (rgb >> 0) & 0xff;

        const lum = [r, g, b].map(channel => {
            channel /= 255;
            return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
        });

        return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
    }

    /**
     * Draws a retro-style pixel avatar on a high-resolution canvas element.
     * 
     * The avatar is generated using an 8x8 grid (or fewer pixels for lower density), and the left half is mirrored to the right.
     * The background and avatar colors are selected from predefined palettes to ensure visual contrast.
     * 
     * @param {string} id - The unique identifier for the avatar.
     * @param {number} size - The size of the avatar in pixels (e.g., 32, 64).
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     * @param {number} density - The density setting, where 1 is the default and 2 means fewer pixels are drawn.
     */
    drawRetroAvatar(id, size, ctx, density) {
        const seed = this.idToSeed(id);
        const gridSize = density === 2 ? 4 : 8; // Adjust grid size for density
        const pixelSize = size / gridSize; // Adjust pixel size based on grid size

        const [avatarColor, backgroundColor] = this.getAvatarAndBackgroundColors(seed);

        // Fill the background
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, size, size);

        // Draw the avatar with the adjusted density and pixel size
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize / 2; x++) {
                const shouldFill = (seed >> (y * 4 + x)) & 1;
                if (shouldFill) {
                    ctx.fillStyle = avatarColor;
                    // Draw pixel on the left side
                    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                    // Draw pixel on the mirrored right side
                    ctx.fillRect((gridSize - 1 - x) * pixelSize, y * pixelSize, pixelSize, pixelSize);
                }
            }
        }
    }
}
