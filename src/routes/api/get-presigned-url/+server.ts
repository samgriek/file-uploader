// src/routes/api/get-presigned-url/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { STSClient, AssumeRoleCommand } from '@aws-sdk/client-sts';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { json } from '@sveltejs/kit';
import { validateToken } from '../../../lib/db.mjs';
import { env } from '$env/dynamic/private';

// Configuration
const REGION = env.PRIVATE_REGION;
const ROLE_ARN = env.PRIVATE_ROLE_ARN;
const BUCKET_NAME = env.PRIVATE_BUCKET_NAME;

const stsClient = new STSClient({ region: REGION });

export const POST: RequestHandler = async ({ request }) => {
  const { fileName, fileType, token } = await request.json();

  console.log("get-presigned-url token", token)

  try {
    const { valid, message } = await validateToken(token);

    if (!valid) {
      return json({ valid: false, message: message, error: "Token not found" }, { status: 400 });
    }

    const assumeRoleCommand = new AssumeRoleCommand({
      RoleArn: ROLE_ARN,
      RoleSessionName: 'S3AccessSession',
    });

    const assumeRoleResponse = await stsClient.send(assumeRoleCommand);

    const temporaryCredentials = {
      accessKeyId: assumeRoleResponse.Credentials?.AccessKeyId!,
      secretAccessKey: assumeRoleResponse.Credentials?.SecretAccessKey!,
      sessionToken: assumeRoleResponse.Credentials?.SessionToken!,
    };

    const s3Client = new S3Client({
      region: REGION,
      credentials: temporaryCredentials,
    });

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return json({ valid: true, message: "Token redeemed", url: signedUrl });

  } catch (error) {
    console.error('Error assuming role or generating presigned URL:', error);
    return json({ error: 'Error generating presigned URL' }, { status: 500 });
  }
};
