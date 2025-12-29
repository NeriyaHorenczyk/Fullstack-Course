// @ts-check

export class AssetLoader {
    /**
     * Initializes the AssetLoader.
     * @param {string} basePath - Base path for all asset URLs
     */
    constructor(basePath = '') {
        this.basePath = basePath;

        /** @type {Map<string, ImageBitmap>} */
        this.images = new Map();

        /** @type {Map<string, HTMLAudioElement>} */
        this.audio = new Map();
    }

    /**
     * Loads a dictionary of assets, automatically routing them to the correct storage.
     * @param {Object.<string, {url: string, scale?: number}>} manifest
     * @returns {Promise<void>}
     */
    async load(manifest) {
        const promises = Object.entries(manifest).map(async ([key, config]) => {
            const { url, scale = 1 } = config;
            const fullUrl = this.basePath + url;

            // basic extension detection
            const extension = url.split('.').pop()?.toLowerCase();

            if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(extension || '')) {
                await this._loadImage(key, fullUrl, scale);
            } else if (['wav', 'mp3', 'ogg'].includes(extension || '')) {
                await this._loadAudio(key, fullUrl);
            } else {
                console.warn(`Unknown asset type for ${url}`);
            }
        });

        await Promise.all(promises);
    }

    /**
     * Internal handler for images
     * @param {string} key
     * @param {string} url
     * @param {number} scale
     */
    async _loadImage(key, url, scale) {
        const img = new Image();
        img.src = url;
        await img.decode();

        /** @type {ImageBitmapOptions | undefined} */
        let options;

        if (scale !== 1) {
            options = {
                resizeWidth: img.naturalWidth * scale,
                resizeHeight: img.naturalHeight * scale,
                resizeQuality: 'pixelated',
            };
        }

        const bitmap = await createImageBitmap(img, options);
        this.images.set(key, bitmap);
    }

    /**
     * Internal handler for audio
     * @param {string} key
     * @param {string} url
     * @returns {Promise<void>}
     */
    async _loadAudio(key, url) {
        return new Promise((resolve, reject) => {
            const audio = new Audio(url);
            audio.addEventListener(
                'canplaythrough',
                () => {
                    this.audio.set(key, audio);
                    resolve();
                },
                { once: true }
            );

            audio.addEventListener('error', (err) => {
                console.error(`Failed to load audio: ${url}`);
                reject(err);
            });
        });
    }

    /**
     * Retrieves an image asset.
     * @param {string} key
     * @returns {ImageBitmap}
     */
    getImage(key) {
        const img = this.images.get(key);
        if (!img) {
            throw new Error(`Image asset '${key}' not found.`);
        }
        return img;
    }

    /**
     * Retrieves an audio asset.
     * @param {string} key
     * @returns {HTMLAudioElement}
     */
    getAudio(key) {
        const sound = this.audio.get(key);
        if (!sound) {
            throw new Error(`Audio asset '${key}' not found.`);
        }
        return sound;
    }
}
