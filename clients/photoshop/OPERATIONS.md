# Adobe Photoshop API - Quick Reference

## Operations Summary

### 🎨 Background & Masking (6 operations)

| Operation         | Method               | Description                                          |
| ----------------- | -------------------- | ---------------------------------------------------- |
| Remove Background | `removeBackground()` | AI-powered background removal (v2)                   |
| Create Mask       | `createMask()`       | Legacy mask creation (deprecated)                    |
| Mask Objects      | `maskObjects()`      | Mask specific objects (person, dog, product, etc.)   |
| Mask Body Parts   | `maskBodyParts()`    | Mask human body parts (face, hair, hands, etc.)      |
| Refine Mask       | `refineMask()`       | Adjust mask with feather, smoothness, contrast, etc. |
| Fill Masked Areas | `fillMaskedAreas()`  | Generative fill or content-aware fill                |

### 📄 PSD Document Operations (8 operations)

| Operation             | Method                  | Description                           |
| --------------------- | ----------------------- | ------------------------------------- |
| Get Document Manifest | `getDocumentManifest()` | Get layer structure and metadata      |
| Create Document       | `createDocument()`      | Create new PSD with custom dimensions |
| Modify Document       | `modifyDocument()`      | Add/edit/delete/move layers           |
| Create Rendition      | `createRendition()`     | Export layers to various formats      |
| Replace Smart Object  | `replaceSmartObject()`  | Update smart object content           |
| Edit Text Layer       | `editTextLayer()`       | Modify text content and styling       |
| Create Artboard       | `createArtboard()`      | Add artboards to PSD                  |

### ⚡ Actions (3 operations)

| Operation              | Method                   | Description                 |
| ---------------------- | ------------------------ | --------------------------- |
| Play Photoshop Actions | `playPhotoshopActions()` | Execute .atn action files   |
| Play Action JSON       | `playActionJson()`       | Execute JSON-format actions |
| Convert to Action JSON | `convertToActionJson()`  | Convert .atn to JSON        |

### ✨ Effects (2 operations)

| Operation        | Method             | Description                   |
| ---------------- | ------------------ | ----------------------------- |
| Auto Crop        | `autoCrop()`       | Automatically crop to content |
| Apply Depth Blur | `applyDepthBlur()` | Apply depth-of-field blur     |

### 📊 Job Status (3 operations)

| Operation                 | Method                    | Description                |
| ------------------------- | ------------------------- | -------------------------- |
| Get Job Status            | `getJobStatus()`          | Check PSD operation status |
| Get Masking Job Status    | `getMaskingJobStatus()`   | Check masking job (v2)     |
| Get Masking Job Status V1 | `getMaskingJobStatusV1()` | Check masking job (v1)     |

---

## Total: 22 Operations

- **Remove Background & Masking**: 6 operations
- **PSD Document Operations**: 8 operations
- **Actions**: 3 operations
- **Effects**: 2 operations
- **Job Status**: 3 operations

## Object Types (Masking)

`person` • `dog` • `cat` • `bird` • `product` • `accessory` • `vehicle` • `furniture` • `plant` • `food` • `building` • `sky` • `ground`

## Body Parts (Masking)

`head` • `face` • `hair` • `neck` • `torso` • `left_arm` • `right_arm` • `left_hand` • `right_hand` • `left_leg` • `right_leg` • `left_foot` • `right_foot`

## Storage Types

`adobe` • `azure` • `dropbox` • `external` • `lightroom`

## Fill Methods

`generativeFill` • `contentAware`

