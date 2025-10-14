import type { IMSClient } from "../ims-client";

// Operation imports
import { removeBackground } from "./operations/remove-background";
import { createMask } from "./operations/create-mask";
import { maskObjects } from "./operations/mask-objects";
import { maskBodyParts } from "./operations/mask-body-parts";
import { refineMask } from "./operations/refine-mask";
import { fillMaskedAreas } from "./operations/fill-masked-areas";
import { getDocumentManifest } from "./operations/document-manifest";
import { createDocument } from "./operations/document-create";
import { modifyDocument } from "./operations/document-operations";
import { createRendition } from "./operations/rendition-create";
import { replaceSmartObject } from "./operations/smart-object-replace";
import { editTextLayer } from "./operations/text-layer-edit";
import { createArtboard } from "./operations/artboard-create";
import { playPhotoshopActions } from "./operations/photoshop-actions";
import { playActionJson, convertToActionJson } from "./operations/action-json";
import { autoCrop } from "./operations/auto-crop";
import { applyDepthBlur } from "./operations/depth-blur";
import { getJobStatus } from "./operations/get-job-status";

/**
 * Client configuration options
 */
export interface PhotoshopClientOptions {
  imsClient: IMSClient;
}

/**
 * Adobe Photoshop API Client
 * Provides methods for image manipulation, PSD operations, and AI-powered effects
 */
export class PhotoshopClient {
  private imsClient: IMSClient;

  constructor(options: PhotoshopClientOptions) {
    this.imsClient = options.imsClient;
  }

  /**
   * Get authentication headers for API requests
   */
  private async getHeaders(): Promise<Record<string, string>> {
    return await this.imsClient.getAuthHeaders();
  }

  // ============================================
  // Remove Background Operations
  // ============================================

  /**
   * Remove background from an image (v2)
   */
  async removeBackground(
    request: Parameters<typeof removeBackground>[0],
  ): Promise<ReturnType<typeof removeBackground>> {
    const headers = await this.getHeaders();
    return removeBackground(request, headers);
  }

  // ============================================
  // Masking Operations
  // ============================================

  /**
   * Create a mask from an image (deprecated, use maskObjects instead)
   */
  async createMask(
    request: Parameters<typeof createMask>[0],
  ): Promise<ReturnType<typeof createMask>> {
    const headers = await this.getHeaders();
    return createMask(request, headers);
  }

  /**
   * Create masks for specific objects in an image
   */
  async maskObjects(
    request: Parameters<typeof maskObjects>[0],
  ): Promise<ReturnType<typeof maskObjects>> {
    const headers = await this.getHeaders();
    return maskObjects(request, headers);
  }

  /**
   * Create masks for specific body parts in an image
   */
  async maskBodyParts(
    request: Parameters<typeof maskBodyParts>[0],
  ): Promise<ReturnType<typeof maskBodyParts>> {
    const headers = await this.getHeaders();
    return maskBodyParts(request, headers);
  }

  /**
   * Refine a mask with various adjustment options
   */
  async refineMask(
    request: Parameters<typeof refineMask>[0],
  ): Promise<ReturnType<typeof refineMask>> {
    const headers = await this.getHeaders();
    return refineMask(request, headers);
  }

  /**
   * Fill masked areas with generative or content-aware fill
   */
  async fillMaskedAreas(
    request: Parameters<typeof fillMaskedAreas>[0],
  ): Promise<ReturnType<typeof fillMaskedAreas>> {
    const headers = await this.getHeaders();
    return fillMaskedAreas(request, headers);
  }

  // ============================================
  // PSD Document Operations
  // ============================================

  /**
   * Get document manifest (layer structure and metadata)
   */
  async getDocumentManifest(
    request: Parameters<typeof getDocumentManifest>[0],
  ): Promise<ReturnType<typeof getDocumentManifest>> {
    const headers = await this.getHeaders();
    return getDocumentManifest(request, headers);
  }

  /**
   * Create a new PSD document
   */
  async createDocument(
    request: Parameters<typeof createDocument>[0],
  ): Promise<ReturnType<typeof createDocument>> {
    const headers = await this.getHeaders();
    return createDocument(request, headers);
  }

  /**
   * Perform operations on a PSD document (add/edit/delete/move layers)
   */
  async modifyDocument(
    request: Parameters<typeof modifyDocument>[0],
  ): Promise<ReturnType<typeof modifyDocument>> {
    const headers = await this.getHeaders();
    return modifyDocument(request, headers);
  }

  /**
   * Create renditions (exports) from a PSD document
   */
  async createRendition(
    request: Parameters<typeof createRendition>[0],
  ): Promise<ReturnType<typeof createRendition>> {
    const headers = await this.getHeaders();
    return createRendition(request, headers);
  }

  /**
   * Replace smart objects in a PSD document
   */
  async replaceSmartObject(
    request: Parameters<typeof replaceSmartObject>[0],
  ): Promise<ReturnType<typeof replaceSmartObject>> {
    const headers = await this.getHeaders();
    return replaceSmartObject(request, headers);
  }

  /**
   * Edit text layers in a PSD document
   */
  async editTextLayer(
    request: Parameters<typeof editTextLayer>[0],
  ): Promise<ReturnType<typeof editTextLayer>> {
    const headers = await this.getHeaders();
    return editTextLayer(request, headers);
  }

  /**
   * Create artboards in a PSD document
   */
  async createArtboard(
    request: Parameters<typeof createArtboard>[0],
  ): Promise<ReturnType<typeof createArtboard>> {
    const headers = await this.getHeaders();
    return createArtboard(request, headers);
  }

  // ============================================
  // Actions Operations
  // ============================================

  /**
   * Play Photoshop actions (.atn files) on an image
   */
  async playPhotoshopActions(
    request: Parameters<typeof playPhotoshopActions>[0],
  ): Promise<ReturnType<typeof playPhotoshopActions>> {
    const headers = await this.getHeaders();
    return playPhotoshopActions(request, headers);
  }

  /**
   * Play Photoshop actions in JSON format on an image
   */
  async playActionJson(
    request: Parameters<typeof playActionJson>[0],
  ): Promise<ReturnType<typeof playActionJson>> {
    const headers = await this.getHeaders();
    return playActionJson(request, headers);
  }

  /**
   * Convert .atn action files to JSON format
   */
  async convertToActionJson(
    request: Parameters<typeof convertToActionJson>[0],
  ): Promise<ReturnType<typeof convertToActionJson>> {
    const headers = await this.getHeaders();
    return convertToActionJson(request, headers);
  }

  // ============================================
  // Effects Operations
  // ============================================

  /**
   * Automatically crop an image to its content
   */
  async autoCrop(
    request: Parameters<typeof autoCrop>[0],
  ): Promise<ReturnType<typeof autoCrop>> {
    const headers = await this.getHeaders();
    return autoCrop(request, headers);
  }

  /**
   * Apply depth-based blur to an image
   */
  async applyDepthBlur(
    request: Parameters<typeof applyDepthBlur>[0],
  ): Promise<ReturnType<typeof applyDepthBlur>> {
    const headers = await this.getHeaders();
    return applyDepthBlur(request, headers);
  }

  // ============================================
  // Status Operations
  // ============================================

  /**
   * Get the status of a Photoshop API job using the status URL
   * Works for all Photoshop operations (PSD, masking, background removal, etc.)
   */
  async getJobStatus(
    statusUrl: Parameters<typeof getJobStatus>[0],
  ): Promise<ReturnType<typeof getJobStatus>> {
    const headers = await this.getHeaders();
    return getJobStatus(statusUrl, headers);
  }
}
