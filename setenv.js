const { writeFileSync } = require('fs');
const { join } = require('path');

// Define the path to your production environment file
const envProdFilePath = join(__dirname, 'src', 'environments', 'environment.ts');

// Get the environment variables from process.env
const recaptcha_SecretKey = process.env.RECAPTCHA_SECRET_KEY;
const stripe_priceAsyncTraining = process.env.STRIPE_PRICE_ASYNC_TRAINING;
const stripe_priceSmallGroupTraining = process.env.STRIPE_PRICE_SMALL_GROUP_TRAINING;

// Build the content of environment.prod.ts
const envFileContent = `export const environment = {
  production: true,
  recaptchaSecretKey: '${recaptcha_SecretKey}',
  priceAsyncTraining: '${stripe_priceAsyncTraining}',
  priceSmallGroupTraining: '${stripe_priceSmallGroupTraining}',
};
`;

// Write the content to the environment file
writeFileSync(envProdFilePath, envFileContent, { encoding: 'utf8' });

console.log(`Wrote environment variables to ${envProdFilePath}`);
