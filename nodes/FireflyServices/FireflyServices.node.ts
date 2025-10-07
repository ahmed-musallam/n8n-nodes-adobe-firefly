import {
	NodeConnectionTypes,
	type INodeType,
	type INodeTypeDescription,
	type IExecuteFunctions,
	type INodeExecutionData,
	type IDataObject,
	LoggerProxy as Logger,
} from 'n8n-workflow';

export class FireflyServices implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Firefly Services',
		name: 'fireflyServices',
		icon: { light: 'file:fireflyServices.svg', dark: 'file:fireflyServices.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with Adobe Firefly API',
		defaults: {
			name: 'Firefly Services',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'fireflyServicesApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Generate Images (Async)',
						value: 'generateImagesAsync',
						description: 'Generate images from text prompt asynchronously',
						action: 'Generate images from text prompt',
					},
					{
						name: 'Get Job Status',
						value: 'getJobStatus',
						description: 'Check the status of an async job',
						action: 'Get async job status',
					},
					{
						name: 'Cancel Job',
						value: 'cancelJob',
						description: 'Cancel an async job',
						action: 'Cancel async job',
					},
				],
				default: 'generateImagesAsync',
			},
			// Generate Images Async parameters
			{
				displayName: 'Prompt',
				name: 'prompt',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'A futuristic cityscape at sunset',
				description: 'Text description of the image to generate (1-1024 characters)',
				typeOptions: {
					rows: 4,
				},
				displayOptions: {
					show: {
						operation: ['generateImagesAsync'],
					},
				},
			},
			{
				displayName: 'Model Version',
				name: 'modelVersion',
				type: 'options',
				options: [
					{ name: 'Image 3', value: 'image3' },
					{ name: 'Image 3 Custom', value: 'image3_custom' },
					{ name: 'Image 4 Standard', value: 'image4_standard' },
					{ name: 'Image 4 Ultra', value: 'image4_ultra' },
					{ name: 'Image 4 Custom', value: 'image4_custom' },
				],
				default: 'image4_standard',
				description: 'The Firefly model version to use',
				displayOptions: {
					show: {
						operation: ['generateImagesAsync'],
					},
				},
			},
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						operation: ['generateImagesAsync'],
					},
				},
				options: [
					{
						displayName: 'Content Class',
						name: 'contentClass',
						type: 'options',
						options: [
							{ name: 'Photo', value: 'photo' },
							{ name: 'Art', value: 'art' },
						],
						default: 'photo',
						description: 'Style of content to generate',
					},
					{
						displayName: 'Custom Model ID',
						name: 'customModelId',
						type: 'string',
						default: '',
						description: 'Required when using custom model versions',
					},
					{
						displayName: 'Number of Variations',
						name: 'numVariations',
						type: 'number',
						default: 1,
						typeOptions: {
							minValue: 1,
							maxValue: 4,
						},
						description: 'Number of image variations to generate (1-4)',
					},
					{
						displayName: 'Negative Prompt',
						name: 'negativePrompt',
						type: 'string',
						default: '',
						description: 'Things to avoid in the generated image',
					},
					{
						displayName: 'Image Size',
						name: 'imageSize',
						type: 'options',
						options: [
							{
								name: '2048x2048 (1:1 Square)',
								value: '2048x2048',
								description: 'Square format - Compatible with all models',
							},
							{
								name: '1024x1024 (1:1 Square)',
								value: '1024x1024',
								description: 'Smaller square - Image 3 only',
							},
							{
								name: '2304x1792 (4:3 Landscape)',
								value: '2304x1792',
								description: 'Standard landscape - Compatible with all models',
							},
							{
								name: '1792x2304 (3:4 Portrait)',
								value: '1792x2304',
								description: 'Standard portrait - Compatible with all models',
							},
							{
								name: '2688x1536 (16:9 Widescreen)',
								value: '2688x1536',
								description: 'Widescreen - Compatible with all models',
							},
							{
								name: '2688x1512 (16:9 Widescreen Alt)',
								value: '2688x1512',
								description: 'Alternative widescreen - Image 3 only',
							},
							{
								name: '1440x2560 (9:16 Vertical)',
								value: '1440x2560',
								description: 'Vertical video format - Image 4 only',
							},
							{
								name: '1344x768 (7:4)',
								value: '1344x768',
								description: 'Wide format - Image 3 only',
							},
							{
								name: '1344x756 (7:4 Alt)',
								value: '1344x756',
								description: 'Alternative wide format - Image 3 only',
							},
							{
								name: '1152x896 (9:7)',
								value: '1152x896',
								description: 'Horizontal format - Image 3 only',
							},
							{
								name: '896x1152 (7:9)',
								value: '896x1152',
								description: 'Vertical format - Image 3 only',
							},
						],
						default: '2048x2048',
						description: 'Select the output image dimensions',
					},
					{
						displayName: 'Visual Intensity',
						name: 'visualIntensity',
						type: 'number',
						default: 6,
						typeOptions: {
							minValue: 2,
							maxValue: 10,
						},
						description: 'Adjust overall intensity (contrast, shadow, hue)',
					},
				],
			},
			// Get Job Status parameters
			{
				displayName: 'Job ID',
				name: 'jobId',
				type: 'string',
				required: true,
				default: '={{ $json.jobId }}',
				description: 'The job ID from the async operation',
				displayOptions: {
					show: {
						operation: ['getJobStatus', 'cancelJob'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// Get credentials
		const credentials = await this.getCredentials('fireflyServicesApi');

		// Get IMS access token
		Logger.info('Fetching IMS access token...');
		const bodyParts = [
			`client_id=${encodeURIComponent(credentials.clientId as string)}`,
			`client_secret=${encodeURIComponent(credentials.clientSecret as string)}`,
			`grant_type=client_credentials`,
			`scope=${encodeURIComponent(credentials.scopes as string)}`,
		];

		const tokenResponse = await this.helpers.httpRequest({
			method: 'POST',
			url: 'https://ims-na1.adobelogin.com/ims/token/v3',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: bodyParts.join('&'),
		});

		const accessToken = tokenResponse.access_token as string;
		Logger.info('Access token obtained successfully');

		// Process each input item
		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				Logger.info(`Processing item ${i}, operation: ${operation}`);

				let responseData: IDataObject;

				if (operation === 'generateImagesAsync') {
					const prompt = this.getNodeParameter('prompt', i) as string;
					const modelVersion = this.getNodeParameter('modelVersion', i) as string;
					const additionalOptions = this.getNodeParameter(
						'additionalOptions',
						i,
						{},
					) as IDataObject;

					// Build request body
					const requestBody: IDataObject = {
						prompt,
					};

					if (additionalOptions.contentClass) {
						requestBody.contentClass = additionalOptions.contentClass;
					}
					if (additionalOptions.customModelId) {
						requestBody.customModelId = additionalOptions.customModelId;
					}
					if (additionalOptions.numVariations) {
						requestBody.numVariations = additionalOptions.numVariations;
					}
					if (additionalOptions.negativePrompt) {
						requestBody.negativePrompt = additionalOptions.negativePrompt;
					}
					if (additionalOptions.visualIntensity) {
						requestBody.visualIntensity = additionalOptions.visualIntensity;
					}

					// Handle image size
					if (additionalOptions.imageSize) {
						const sizeStr = additionalOptions.imageSize as string;
						const [width, height] = sizeStr.split('x').map(Number);
						requestBody.size = { width, height };
					}

					Logger.info('Making request to generate images...', { requestBody });

					responseData = await this.helpers.httpRequest({
						method: 'POST',
						url: 'https://firefly-api.adobe.io/v3/images/generate-async',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${accessToken}`,
							'x-api-key': credentials.clientId as string,
							'x-model-version': modelVersion,
						},
						body: requestBody,
					});

					Logger.info('Generate images response:', { responseData });
				} else if (operation === 'getJobStatus') {
					const jobId = this.getNodeParameter('jobId', i) as string;

					Logger.info('Getting job status...', { jobId });

					responseData = await this.helpers.httpRequest({
						method: 'GET',
						url: `https://firefly-api.adobe.io/v3/status/${jobId}`,
						headers: {
							Authorization: `Bearer ${accessToken}`,
							'x-api-key': credentials.clientId as string,
						},
					});

					Logger.info('Job status response:', { responseData });
				} else if (operation === 'cancelJob') {
					const jobId = this.getNodeParameter('jobId', i) as string;

					Logger.info('Canceling job...', { jobId });

					responseData = await this.helpers.httpRequest({
						method: 'PUT',
						url: `https://firefly-api.adobe.io/v3/cancel/${jobId}`,
						headers: {
							Authorization: `Bearer ${accessToken}`,
							'x-api-key': credentials.clientId as string,
						},
					});

					Logger.info('Cancel job response:', { responseData });
				} else {
					throw new Error(`Unknown operation: ${operation}`);
				}

				returnData.push({
					json: responseData,
					pairedItem: i,
				});
			} catch (error) {
				Logger.error('Error processing item:', {
					error: (error as Error).message,
					stack: (error as Error).stack,
				});
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: i,
					});
					continue;
				}
				throw error;
			}
		}

		Logger.info('Return data count:', { count: returnData.length });
		Logger.info('=== FireflyServices Execute End ===');

		return [returnData];
	}
}
