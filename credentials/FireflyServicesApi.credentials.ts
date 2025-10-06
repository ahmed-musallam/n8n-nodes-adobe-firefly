import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class FireflyServicesApi implements ICredentialType {
	name = 'fireflyServicesApi';

	displayName = 'Firefly Services API';

	documentationUrl = 'https://developer.adobe.com/firefly-services/docs/guides/';

	properties: INodeProperties[] = [
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			required: true,
			default: '',
			description: 'The Client ID (API Key) from Adobe Developer Console',
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			description: 'The Client Secret from Adobe Developer Console',
		},
		{
			displayName: 'Scopes',
			name: 'scopes',
			type: 'string',
			default: 'openid,AdobeID,firefly_api,firefly_enterprise,ff_apis,read_organizations',
			description: 'OAuth scopes required for Firefly API (comma-separated)',
		},
	];
}
