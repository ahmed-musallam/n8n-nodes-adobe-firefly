/**
 * Common types shared across Substance 3D API operations
 */

import type { IMSClient } from "../../ims-client";

export interface SubstanceClientOptions {
  imsClient: IMSClient;
  baseUrl?: string; // override for testing
}

export type SubstanceJobStatus =
  | "not_started"
  | "running"
  | "succeeded"
  | "failed";

export interface SubstanceJobResponse {
  $schema?: string;
  id: string;
  status: SubstanceJobStatus;
  url: string;
  bugReportUrl: string;
  error?: string;
  result?: unknown;
}

export interface SubstanceSpace {
  $schema?: string;
  id: string;
  url: string;
  archiveUrl: string;
  files: Array<{
    name: string;
    size: number;
    url: string;
  }> | null;
}

export interface MountedSource {
  mountPoint?: string;
  url?: {
    url: string;
    filename?: string;
  };
  space?: {
    id: string;
  };
  "frame.io"?: {
    folderId: string;
    accessToken: string;
  };
  "next.frame.io"?: {
    folderId: string;
    accountId: string;
    accessToken: string;
  };
}

export interface OutputSize {
  width: number; // 1-2688
  height: number; // 1-2688
}
