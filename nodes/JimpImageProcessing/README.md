# Jimp - Image Processing Node

Process images using Jimp (JavaScript Image Manipulation Program). This node provides various image processing operations including resizing, ensuring maximum dimensions, overlaying images, and more.

## Features

- ✅ Ensure images stay within maximum dimensions
- ✅ Overlay foreground images onto background with positioning
- ✅ Automatic aspect ratio preservation
- ✅ Multiple resize algorithms (Bilinear, Bicubic, Nearest Neighbor)
- ✅ Configurable margins (insets) and alignment
- ✅ Opacity control for overlays
- ✅ Support for various image formats (JPEG, PNG, BMP, TIFF, GIF)
- ✅ Detailed output information (dimensions, file size, positions, etc.)

## Operations

### Ensure Max Size

Ensures an image is within specified maximum dimensions. If the image is larger, it will be resized while maintaining the aspect ratio.

#### Use Case

This is particularly useful when:

- Preparing images for APIs with size restrictions (e.g., Adobe Firefly requires images under 5000x5000px)
- Reducing file sizes for web delivery
- Standardizing image dimensions across a workflow
- Preventing out-of-memory errors with very large images

#### Parameters

**Required:**

- **Binary Property**: Name of the binary property containing the image (default: `data`)
- **Max Width**: Maximum width in pixels (default: 5000)
- **Max Height**: Maximum height in pixels (default: 5000)
- **Output Property Name**: Name for the output binary property (default: `data`)

**Optional:**

- **Resize Algorithm**:
  - `Bilinear` - Good balance of quality and speed (default)
  - `Bicubic` - Higher quality, slower
  - `Nearest Neighbor` - Fastest, lower quality
- **Only Resize If Larger**: If true, only resizes when image exceeds max dimensions (default: true)

#### How It Works

1. Reads the image from the binary property
2. Checks if dimensions exceed max width or max height
3. If larger, calculates new dimensions maintaining aspect ratio:
   - For landscape images: scales based on width first
   - For portrait images: scales based on height first
   - Ensures neither dimension exceeds the maximum
4. Resizes using the selected algorithm
5. Outputs the processed image with metadata

#### Examples

**Example 1: Ensure image fits within 5000x5000**

Input image: 8000x6000px  
Max Width: 5000  
Max Height: 5000  
Result: 5000x3750px (maintains 4:3 aspect ratio)

**Example 2: Portrait image**

Input image: 3000x6000px  
Max Width: 5000  
Max Height: 5000  
Result: 2500x5000px (maintains 1:2 aspect ratio)

**Example 3: Already within limits**

Input image: 2000x1500px  
Max Width: 5000  
Max Height: 5000  
Result: 2000x1500px (no resize needed)

**Example 4: Square image**

Input image: 7000x7000px  
Max Width: 5000  
Max Height: 5000  
Result: 5000x5000px

### Overlay Images

Overlays a foreground image onto a background image with precise positioning control. The foreground is automatically resized to fit within the background while maintaining its aspect ratio, respecting the specified margins (insets).

#### Use Case

This is particularly useful when:

- Creating product mockups (placing product on lifestyle backgrounds)
- Adding watermarks or logos to images
- Creating composite images with precise layout control
- Building image templates with dynamic content
- Adding frames or borders to images

#### Parameters

**Required:**

- **Background Property**: Name of the binary property with the background image (default: `data`)
- **Foreground Property**: Name of the binary property with the foreground image (default: `foreground`)
- **Output Property Name**: Name for the output binary property (default: `data`)
- **Horizontal Alignment**: Position foreground horizontally (`left`, `center`, `right`)
- **Vertical Alignment**: Position foreground vertically (`top`, `middle`, `bottom`)

**Insets (Margins):**

- **Top**: Top margin in pixels (default: 0)
- **Bottom**: Bottom margin in pixels (default: 0)
- **Left**: Left margin in pixels (default: 0)
- **Right**: Right margin in pixels (default: 0)

**Optional:**

- **Resize Algorithm**: Same options as Ensure Max Size
- **Opacity**: Opacity of foreground image, 0-1 (default: 1)

#### How It Works

1. Reads both background and foreground images
2. Calculates available space: `background dimensions - insets`
3. Resizes foreground to fit within available space while maintaining aspect ratio
4. Positions foreground based on alignment settings
5. Composites foreground onto background
6. Returns the combined image

#### Examples

**Example 1: Centered logo on background**

```
Background: 1920x1080px
Foreground (logo): 800x800px
Insets: top=50, bottom=50, left=50, right=50
Alignment: center/middle
Available space: 1820x980px
Result: Logo resized to 980x980px, centered in background
```

**Example 2: Product in corner with margins**

```
Background: 2000x2000px
Foreground (product): 1000x1500px
Insets: top=100, right=100, bottom=100, left=100
Alignment: right/bottom
Available space: 1800x1800px
Result: Product resized to 1200x1800px, positioned at bottom-right
```

**Example 3: Watermark with transparency**

```
Background: Any size
Foreground (watermark): Any size
Alignment: right/bottom
Insets: right=20, bottom=20
Opacity: 0.5
Result: Semi-transparent watermark in bottom-right corner
```

## Output

### Ensure Max Size Output

```json
{
  "originalWidth": 8000,
  "originalHeight": 6000,
  "newWidth": 5000,
  "newHeight": 3750,
  "resized": true,
  "fileSize": 1245678,
  "mimeType": "image/jpeg",
  "fileName": "processed-image.jpg"
}
```

### Overlay Images Output

```json
{
  "backgroundWidth": 1920,
  "backgroundHeight": 1080,
  "foregroundOriginalWidth": 800,
  "foregroundOriginalHeight": 800,
  "foregroundResizedWidth": 980,
  "foregroundResizedHeight": 980,
  "positionX": 470,
  "positionY": 50,
  "insets": {
    "top": 50,
    "bottom": 50,
    "left": 50,
    "right": 50
  },
  "alignment": {
    "horizontal": "center",
    "vertical": "middle"
  },
  "fileSize": 1456789,
  "mimeType": "image/png",
  "fileName": "composited-image.png"
}
```

The processed image is stored in the specified binary property.

## Supported Image Formats

- JPEG / JPG
- PNG
- BMP
- TIFF
- GIF

## Performance Considerations

### Resize Algorithms

- **Bilinear** (default): Best balance for most use cases
- **Bicubic**: Use for higher quality when processing time is not critical
- **Nearest Neighbor**: Use when speed is critical and quality is less important (e.g., pixel art)

### Memory Usage

Processing very large images can consume significant memory. Consider:

- Processing images in smaller batches
- Using appropriate resize algorithms
- Monitoring n8n memory usage

## Common Workflows

### Prepare Images for Adobe Firefly

```
1. Read images from source
2. Jimp - Ensure Max Size (5000x5000)
3. Adobe Firefly - Generate Images (use as reference)
```

### Optimize Images for Web

```
1. Read images from folder
2. Jimp - Ensure Max Size (1920x1080)
3. Upload to CDN or storage
```

### Batch Process and Resize

```
1. Webhook receives images
2. Jimp - Ensure Max Size (custom dimensions)
3. Save to different storage locations
```

### Add Watermark to Images

```
1. Read images from folder (background)
2. Read watermark logo (foreground)
3. Jimp - Overlay Images (align right/bottom, insets 20px, opacity 0.7)
4. Save watermarked images
```

### Create Product Mockup

```
1. Load lifestyle background image
2. Load product image
3. Jimp - Overlay Images (center/middle, with insets for frame effect)
4. Export final mockup
```

## Error Handling

The node will throw errors if:

- Binary property doesn't exist or is not an image
- Image format is not supported
- Image is corrupted or invalid
- Insets are too large (no space left for foreground in overlay operation)

Enable "Continue On Fail" in node settings to handle errors gracefully.

## Tips

1. **Keep Original**: Set a different output property name to keep both original and processed images
2. **Batch Processing**: The node processes each item in the input array
3. **Format Preservation**: Output maintains the original image format (JPEG stays JPEG, PNG stays PNG)
4. **Algorithm Selection**: Use Bilinear for best balance, Bicubic for highest quality, Nearest Neighbor for fastest processing
5. **Overlay with Transparency**: Use PNG format for foregrounds with transparency, and adjust opacity for watermark effects
6. **Multiple Binaries**: For overlay operation, ensure both binary properties exist in the same item. Use merge nodes if needed to combine data

## Related Documentation

- [Jimp GitHub Repository](https://github.com/jimp-dev/jimp)
- [Jimp Documentation](https://github.com/jimp-dev/jimp/tree/main/packages/jimp)
