/**
 * gRPC service definition placeholder.
 * Real .proto files live in contracts/*.proto; generated stubs consumed here.
 */

// Canonical mapping — keep service/method naming stable for contract tests.
export const SAMPLE_GRPC_SERVICE = 'feature.sample.v1.SampleService';

export const SAMPLE_GRPC_METHODS = {
  CreateSample: 'CreateSample',
  GetSample: 'GetSample',
  ActivateSample: 'ActivateSample',
} as const;

export type SampleGrpcMethod = (typeof SAMPLE_GRPC_METHODS)[keyof typeof SAMPLE_GRPC_METHODS];

export interface GrpcSampleServer {
  addService(
    service: string,
    implementation: Record<SampleGrpcMethod, (...args: unknown[]) => Promise<unknown>>
  ): void;
}
