# Adobe Firefly API Integration

## API Documentation Reference

**OpenAPI Spec Location**: `.cursor/schema/image_generation_async_v3.json`

When implementing API operations, always reference the OpenAPI spec for:

- Endpoint paths and methods
- Request/response schemas
- Authentication requirements
- Parameter definitions

## IMS authentication

All APIs used in this project use server-to-server credentials, see: https://developer.adobe.com/developer-console/docs/guides/authentication/ServerToServerAuthentication/ims#fetching-access-tokens

## Server-to-Server Authentication Flow (Simplified)

The Adobe Firefly API uses the **OAuth 2.0 Client Credentials** flow for server-to-server authentication. You can obtain an access token directly using your `client_id`, `client_secret`, and the required `scope`.

### Prerequisites

- **Adobe Developer Console Project**: Create a project and add the Firefly API.
- **Service Account Credentials**: Note your:
  - `Client ID` (API Key)
  - `Client Secret`
- **Required Scopes**: For Firefly, use: `openid, AdobeID, firefly_api, firefly_enterprise, ff_apis,read_organizations`

### Authentication Steps

1. **Request an Access Token**

   Make a `POST` request to the Adobe IMS token endpoint:

   ```
   POST https://ims-na1.adobelogin.com/ims/token/v3
   Content-Type: application/x-www-form-urlencoded

   client_id={CLIENT_ID}
   client_secret={CLIENT_SECRET}
   grant_type=client_credentials
   scope=openid, AdobeID, firefly_api, firefly_enterprise, ff_apis,read_organizations
   ```

   **Example cURL:**

   ```sh
   curl -X POST 'https://ims-na1.adobelogin.com/ims/token/v3' \
     -H 'Content-Type: application/x-www-form-urlencoded' \
     -d 'client_id=YOUR_CLIENT_ID' \
     -d 'client_secret=YOUR_CLIENT_SECRET' \
     -d 'grant_type=client_credentials' \
     -d 'scope=ent_firefly'
   ```

   **Response:**

   ```json
   {
     "access_token": "eyJ4NXQiOiJ...",
     "token_type": "bearer",
     "expires_in": 86399999
   }
   ```

2. **Use the Access Token**

   For all Firefly API requests, include these headers:
   - `Authorization: Bearer {access_token}`
   - `x-api-key: {CLIENT_ID}`

**Note:** The access token is valid for a limited time (typically 24 hours). Refresh it as needed for continued access.
