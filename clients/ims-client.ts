/**
 * IMS (Adobe Identity Management System) Client for OAuth 2.0 Client Credentials Flow
 * See: https://developer.adobe.com/developer-console/docs/guides/authentication/ServerToServerAuthentication/ims#fetching-access-tokens
 */

export type IMSClientOptions = {
  clientId: string;
  clientSecret: string;
  scope?: string; // optional, will use recommended default if not provided
  tokenEndpoint?: string; // optional, override for testing
};

type IMSTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export class IMSClient {
  private clientId: string;
  private clientSecret: string;
  private scope: string;
  private tokenEndpoint: string;
  private cachedToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor(options: IMSClientOptions) {
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.scope =
      options.scope ??
      "openid,AdobeID,firefly_api,firefly_enterprise,ff_apis,read_organizations";
    this.tokenEndpoint =
      options.tokenEndpoint ?? "https://ims-na1.adobelogin.com/ims/token/v3";
  }

  /**
   * Get a valid access token, using cache if not expired.
   */
  async getAccessToken(): Promise<string> {
    const now = Date.now();
    // Add a buffer (e.g., 60s) to avoid using an about-to-expire token
    if (this.cachedToken && now < this.tokenExpiresAt - 60000) {
      return this.cachedToken;
    }
    const tokenData = await this.fetchAccessToken();
    this.cachedToken = tokenData.access_token;
    this.tokenExpiresAt = now + tokenData.expires_in * 1000;
    return this.cachedToken;
  }

  /**
   * Fetch a new access token from IMS.
   */
  private async fetchAccessToken(): Promise<IMSTokenResponse> {
    const params = new URLSearchParams();
    params.append("client_id", this.clientId);
    params.append("client_secret", this.clientSecret);
    params.append("grant_type", "client_credentials");
    params.append("scope", this.scope);

    const response = await fetch(this.tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `IMS token request failed: ${response.status} ${response.statusText} - ${errorText}`,
      );
    }

    const data = (await response.json()) as IMSTokenResponse;
    if (!data.access_token) {
      throw new Error("IMS token response missing access_token");
    }
    return data;
  }

  /**
   * Get headers for authenticated Firefly API requests.
   */
  async getAuthHeaders(): Promise<Record<string, string>> {
    const accessToken = await this.getAccessToken();
    return {
      Authorization: `Bearer ${accessToken}`,
      "x-api-key": this.clientId,
    };
  }
}
