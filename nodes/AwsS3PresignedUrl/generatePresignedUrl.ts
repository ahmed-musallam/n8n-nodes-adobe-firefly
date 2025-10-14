import { createHash, createHmac } from "crypto";
import type {
  IDataObject,
  IExecuteFunctions,
  IHookFunctions,
  ILoadOptionsFunctions,
  IWebhookFunctions,
} from "n8n-workflow";

function hmacSha256(key: Buffer | string, data: string): Buffer {
  return createHmac("sha256", key).update(data).digest();
}

function getSignatureKey(
  secretKey: string,
  dateStamp: string,
  regionName: string,
  serviceName: string,
): Buffer {
  const kDate = hmacSha256("AWS4" + secretKey, dateStamp);
  const kRegion = hmacSha256(kDate, regionName);
  const kService = hmacSha256(kRegion, serviceName);
  const kSigning = hmacSha256(kService, "aws4_request");
  return kSigning;
}

export async function generatePresignedUrl(
  this:
    | IHookFunctions
    | IExecuteFunctions
    | ILoadOptionsFunctions
    | IWebhookFunctions,
  bucketName: string,
  fileKey: string,
  expiresIn: number,
  query: IDataObject = {},
  region?: string,
): Promise<string> {
  const credentials = await this.getCredentials("aws");

  const accessKeyId = `${credentials.accessKeyId}`.trim();
  const secretAccessKey = `${credentials.secretAccessKey}`.trim();
  const regionName = (region || credentials.region || "us-east-1") as string;

  // Determine the endpoint
  let host: string;
  let canonicalUri: string;

  if (bucketName.includes(".")) {
    // Bucket name contains dots, use path-style
    host = `s3.${regionName}.amazonaws.com`;
    canonicalUri = `/${bucketName}/${fileKey}`;
  } else {
    // Use virtual-hosted-style
    host = `${bucketName}.s3.${regionName}.amazonaws.com`;
    canonicalUri = `/${fileKey}`;
  }

  // Get current time
  const now = new Date();
  const amzDate = now
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
  const dateStamp = amzDate.substring(0, 8);
  const credentialScope = `${dateStamp}/${regionName}/s3/aws4_request`;

  // Build canonical query string
  const queryParams: Record<string, string> = {
    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
    "X-Amz-Credential": `${accessKeyId}/${credentialScope}`,
    "X-Amz-Date": amzDate,
    "X-Amz-Expires": expiresIn.toString(),
    "X-Amz-SignedHeaders": "host",
  };

  // Add session token if using temporary credentials
  if (credentials.sessionToken) {
    queryParams["X-Amz-Security-Token"] = `${credentials.sessionToken}`.trim();
  }

  // Add additional query parameters
  Object.entries(query).forEach(([key, value]) => {
    queryParams[key] = value as string;
  });

  // Sort query parameters
  const sortedQueryParams = Object.keys(queryParams)
    .sort()
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`,
    )
    .join("&");

  // Build canonical request
  const canonicalHeaders = `host:${host}\n`;
  const signedHeaders = "host";
  const payloadHash = "UNSIGNED-PAYLOAD";

  const canonicalRequest = `GET\n${canonicalUri}\n${sortedQueryParams}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

  // Create string to sign
  const algorithm = "AWS4-HMAC-SHA256";
  const canonicalRequestHash = createHash("sha256")
    .update(canonicalRequest)
    .digest("hex");
  const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${canonicalRequestHash}`;

  // Calculate signature
  const signingKey = getSignatureKey(
    secretAccessKey,
    dateStamp,
    regionName,
    "s3",
  );
  const signature = hmacSha256(signingKey, stringToSign).toString("hex");

  // Build final URL with signature
  const finalUrl = `https://${host}${canonicalUri}?${sortedQueryParams}&X-Amz-Signature=${signature}`;

  return finalUrl;
}
