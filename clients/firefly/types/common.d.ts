/**
 * Common types shared across Firefly API operations
 */

import type { IMSClient } from "../../ims-client";

export interface FireflyClientOptions {
  imsClient: IMSClient;
  baseUrl?: string; // override for testing
}

export type ModelVersion =
  | "image3"
  | "image3_custom"
  | "image4_standard"
  | "image4_ultra"
  | "image4_custom";

export type VideoModelVersion = "video1_standard";

