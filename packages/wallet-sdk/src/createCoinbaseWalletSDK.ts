import { createCoinbaseWalletProvider } from './createCoinbaseWalletProvider.js';
import { VERSION } from './sdk-info.js';
import {
  AppMetadata,
  ConstructorOptions,
  Preference,
  ProviderInterface,
} from ':core/provider/interface.js';
import { ScopedLocalStorage } from ':core/storage/ScopedLocalStorage.js';
import { checkCrossOriginOpenerPolicy } from ':util/checkCrossOriginOpenerPolicy.js';
import { validatePreferences } from ':util/validatePreferences.js';

export type CreateCoinbaseWalletSDKOptions = Partial<AppMetadata> & {
  preference?: Preference;
};

const DEFAULT_PREFERENCE: Preference = {
  options: 'all',
};

/**
 * Create a Coinbase Wallet SDK instance.
 * @param params - Options to create a Coinbase Wallet SDK instance.
 * @returns A Coinbase Wallet SDK object.
 */
export function createCoinbaseWalletSDK(params: CreateCoinbaseWalletSDKOptions) {
  const versionStorage = new ScopedLocalStorage('CBWSDK');
  versionStorage.setItem('VERSION', VERSION);

  void checkCrossOriginOpenerPolicy();

  const options: ConstructorOptions = {
    metadata: {
      appName: params.appName || 'Dapp',
      appLogoUrl: params.appLogoUrl || '',
      appChainIds: params.appChainIds || [],
    },
    preference: Object.assign(DEFAULT_PREFERENCE, params.preference ?? {}),
  };

  /**
   * Validate user supplied preferences. Throws if key/values are not valid.
   */
  validatePreferences(options.preference);

  let provider: ProviderInterface | null = null;

  return {
    getProvider: () => {
      if (!provider) {
        provider = createCoinbaseWalletProvider(options);
      }
      return provider;
    },
  };
}
