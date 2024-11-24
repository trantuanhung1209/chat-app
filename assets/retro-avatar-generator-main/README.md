# RetroAvatarGenerator

RetroAvatarGenerator is a lightweight JavaScript library that generates unique, retro-style pixel avatars based on a string identifier. These avatars are drawn on high-resolution canvas elements, ensuring smooth resizing and high-quality visuals. The library offers customization options including avatar size, rounded corners, and pixel density.

# Demo
> [Open demo.](https://htmlpreview.github.io/?https://github.com/lyes2k/retro-avatar-generator/blob/main/demo.html)

## Features

- **Unique Avatars**: Generate unique avatars based on any string identifier (e.g., user ID).
- **High-Resolution Rendering**: Avatars are drawn at a high resolution with supersampling, ensuring crisp visuals at any display size.
- **Customizable Size**: Control the avatar size through a simple data attribute.
- **Rounded Corners**: Optionally create circular or rounded avatars.
- **Pixel Density**: Adjust the pixel density to create avatars with more or fewer pixels.

## Installation

To use RetroAvatarGenerator, simply include the JavaScript file in your project.

### Download

Download the `retro-avatar-generator.js` file and include it in your project:

```html
<script src="path/to/retro-avatar-generator.js"></script>
```

## Usage

1. Add a `<span>` element with the class `retro-avatar` where you want the avatar to appear.
2. Add the required `data-retro-id` attribute, and optionally include `data-retro-size`, `data-round`, and `data-density` attributes for customization.

### Example

```html
<span class="retro-avatar" 
      data-retro-id="user12345" 
      data-retro-size="64" 
      data-round="1" 
      data-density="2"></span>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        new RetroAvatarGenerator();
    });
</script>
```

### Attributes

- `data-retro-id`: A unique string that generates a unique avatar.
- `data-retro-size`: The size of the avatar in pixels (default: 32).
- `data-round`: Set to `1` for circular avatars, `2` for avatars with rounded corners (default: no rounding).
- `data-density`: Set to `1` for standard pixel density (default), or `2` for fewer, larger pixels.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## Issues

If you encounter any issues or have feature requests, please [submit an issue](https://github.com/lyes2k/retro-avatar-generator/issues) on GitHub.
