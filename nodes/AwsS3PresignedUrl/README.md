# AWS S3 Presigned URL Node

Generate presigned URLs for AWS S3 objects. Presigned URLs provide temporary, secure access to S3 objects without requiring AWS credentials.

## Features

- ✅ Generate presigned URLs for GET requests (download)
- ✅ Support for both virtual-hosted-style and path-style URLs
- ✅ Configurable expiration time (1 second to 7 days)
- ✅ Support for custom response headers (Content-Type, Content-Disposition, Cache-Control)
- ✅ Support for temporary credentials (session tokens)
- ✅ Custom query parameters

## Prerequisites

You need AWS credentials configured in n8n. The node uses the built-in `aws` credential type from n8n's AWS S3 node.

### Required AWS Permissions

Your AWS credentials need at least the following permissions:

- `s3:GetObject` - To generate presigned URLs for downloading objects

## Configuration

### Credentials

Use the built-in **AWS** credential in n8n with:

- **Access Key ID**: Your AWS access key
- **Secret Access Key**: Your AWS secret key
- **Region**: AWS region (e.g., `us-east-1`, `eu-west-1`)
- **Session Token** (optional): For temporary credentials

### Parameters

#### Required Parameters

- **Bucket Name**: The name of your S3 bucket (e.g., `my-bucket`)
- **Object Key**: The key (path) of the object in S3 (e.g., `path/to/file.jpg`)
- **Expires In (Seconds)**: URL expiration time in seconds (default: 3600 = 1 hour)
  - Minimum: 1 second
  - Maximum: 604800 seconds (7 days)

#### Optional Parameters

- **Region**: Override the region from credentials
- **Response Content Type**: Set the Content-Type header (e.g., `image/jpeg`)
- **Response Content Disposition**: Set the Content-Disposition header (e.g., `attachment; filename="file.jpg"`)
- **Response Cache Control**: Set the Cache-Control header (e.g., `no-cache, no-store`)
- **Custom Query Parameters**: Add additional query parameters to the URL

## Output

The node returns a JSON object with:

```json
{
  "bucketName": "my-bucket",
  "objectKey": "path/to/file.jpg",
  "expiresIn": 3600,
  "region": "us-east-1",
  "presignedUrl": "https://my-bucket.s3.us-east-1.amazonaws.com/path/to/file.jpg?...",
  "expiresAt": "2024-10-13T14:30:00.000Z"
}
```

## Examples

### Basic Usage

Generate a presigned URL that expires in 1 hour:

```
Bucket Name: my-bucket
Object Key: photos/vacation.jpg
Expires In: 3600
```

### Force Download with Custom Filename

Generate a URL that forces download with a custom filename:

```
Bucket Name: my-documents
Object Key: reports/2024-Q3-report.pdf
Expires In: 7200
Response Content Disposition: attachment; filename="Q3-Report.pdf"
```

### Set Content Type for Images

Generate a URL for an image with proper Content-Type:

```
Bucket Name: image-storage
Object Key: uploads/profile-pic.png
Expires In: 3600
Response Content Type: image/png
```

### Short-lived URL (5 minutes)

For sensitive documents that should expire quickly:

```
Bucket Name: secure-docs
Object Key: private/document.pdf
Expires In: 300
```

## Use Cases

1. **Share Private Files**: Generate temporary URLs to share files from private S3 buckets
2. **Download with Custom Headers**: Force downloads or set specific content types
3. **Temporary Access**: Provide time-limited access to S3 objects
4. **Direct Downloads**: Allow users to download files directly from S3 without proxying through your server
5. **Image Delivery**: Generate URLs for images stored in S3 with proper content types
6. **Secure File Sharing**: Share files securely without making your bucket public

## Notes

### Bucket Naming

- **Buckets without dots**: Uses virtual-hosted-style URLs  
  `https://my-bucket.s3.region.amazonaws.com/path/file.ext`
- **Buckets with dots**: Uses path-style URLs  
  `https://s3.region.amazonaws.com/my.bucket/path/file.ext`

### Expiration Time

- The URL expiration is based on the time the URL was generated
- Maximum expiration time is 7 days (604800 seconds)
- Consider shorter expiration times for sensitive content

### Security Best Practices

1. Use the minimum expiration time needed for your use case
2. Consider using session tokens for temporary credentials
3. Apply least-privilege IAM policies (only `s3:GetObject` if only generating download URLs)
4. Monitor CloudTrail logs for presigned URL usage

## Troubleshooting

### URL Returns "Access Denied"

- Check your IAM permissions include `s3:GetObject`
- Verify the bucket and object key are correct
- Ensure the object exists in the bucket
- Check bucket policies don't explicitly deny access

### URL Expired

- The URL has passed its expiration time
- Generate a new URL with a longer expiration period

### Invalid Signature Error

- Check your AWS credentials are correct
- Verify the region matches where your bucket is located
- Ensure system time is synchronized (for generating signatures)

## Related Documentation

- [AWS S3 Presigned URLs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ShareObjectPreSignedURL.html)
- [AWS Signature Version 4](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html)
