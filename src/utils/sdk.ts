import {useEffect, useRef, useCallback} from 'react';
import {Appwrite} from 'appwrite';

// Fill with your Appwrite API endpoint, Project ID and collection ID!
const REACT_APP_ENDPOINT = '';
const REACT_APP_PROJECT_ID = '';
const REACT_APP_COLLECTION_ID = '';
const USE_GITHUB_SIGNIN = true;

export type UserType = {
  $id: string;
  name: string;
  registration: number;
  status: number;
  passwordUpdate: number;
  email: string;
  emailVerification: boolean;
  prefs: unknown[];
};

export type SessionType = {
  $id: string;
  userId: string;
  expire: number;
  provider: string;
  providerUid: string;
  providerToken: string;
  ip: string;
  osCode: string;
  osName: string;
  osVersion: string;
  clientType: string;
  clientCode: string;
  clientName: string;
  clientVersion: string;
  clientEngine: string;
  clientEngineVersion: string;
  deviceName: string;
  deviceBrand: string;
  deviceModel: string;
  countryCode: string;
  countryName: string;
  current: boolean;
};

type PermissionsType = {
  read: string[];
  write: string[];
};

export type TodoDocumentType = {
  $id: string;
  $collection: string;
  $permissions: PermissionsType;
  content: string;
  isComplete: boolean;
};

export type TodoDocumentListType = {
  sum: number;
  documents: TodoDocumentType[];
};

export class SDKAbortedRequestError extends Error {
  sdkAbortedError: boolean;

  constructor(message: string | undefined) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SDKAbortedRequestError);
    }

    this.name = 'SDKAbortedRequestError';
    this.sdkAbortedError = true;
  }
}

const AbortableRequest = <T>(
  signal: AbortSignal,
  promise: Promise<T>,
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const abortError = new SDKAbortedRequestError('SDK Request Aborted');

    promise
      .then(result => (signal.aborted ? reject(abortError) : resolve(result)))
      .catch(error => (signal.aborted ? reject(abortError) : reject(error)));
  });
};

// useAbortableRequest custom hook
export const useAbortableRequest = () => {
  const abortRequest = useRef(new AbortController());

  // Effect that aborts all lingering requests after the component unmounts
  // in order to avoid state change after unmounting
  useEffect(() => {
    const controller = abortRequest.current;
    return () => controller.abort();
  }, []);

  return useCallback(<T>(request: Promise<T>) => {
    return AbortableRequest(abortRequest.current.signal, request);
  }, []);
};

const sdk = new Appwrite();
// Fill with your Appwrite API endpoint and Project ID!
sdk.setEndpoint(REACT_APP_ENDPOINT).setProject(REACT_APP_PROJECT_ID);
export const collectionId = REACT_APP_COLLECTION_ID;

export const useGithub = USE_GITHUB_SIGNIN;

export default sdk;
