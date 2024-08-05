// Original file: proto/create-game.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { CreateRequest as _CreateRequest, CreateRequest__Output as _CreateRequest__Output } from './CreateRequest';
import type { CreateResponse as _CreateResponse, CreateResponse__Output as _CreateResponse__Output } from './CreateResponse';
import type { DeleteRequest as _DeleteRequest, DeleteRequest__Output as _DeleteRequest__Output } from './DeleteRequest';
import type { DeleteResponse as _DeleteResponse, DeleteResponse__Output as _DeleteResponse__Output } from './DeleteResponse';

export interface GameHandlerClient extends grpc.Client {
  CreateGame(argument: _CreateRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_CreateResponse__Output>): grpc.ClientUnaryCall;
  CreateGame(argument: _CreateRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_CreateResponse__Output>): grpc.ClientUnaryCall;
  CreateGame(argument: _CreateRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_CreateResponse__Output>): grpc.ClientUnaryCall;
  CreateGame(argument: _CreateRequest, callback: grpc.requestCallback<_CreateResponse__Output>): grpc.ClientUnaryCall;
  createGame(argument: _CreateRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_CreateResponse__Output>): grpc.ClientUnaryCall;
  createGame(argument: _CreateRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_CreateResponse__Output>): grpc.ClientUnaryCall;
  createGame(argument: _CreateRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_CreateResponse__Output>): grpc.ClientUnaryCall;
  createGame(argument: _CreateRequest, callback: grpc.requestCallback<_CreateResponse__Output>): grpc.ClientUnaryCall;
  
  DeleteGame(argument: _DeleteRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_DeleteResponse__Output>): grpc.ClientUnaryCall;
  DeleteGame(argument: _DeleteRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_DeleteResponse__Output>): grpc.ClientUnaryCall;
  DeleteGame(argument: _DeleteRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_DeleteResponse__Output>): grpc.ClientUnaryCall;
  DeleteGame(argument: _DeleteRequest, callback: grpc.requestCallback<_DeleteResponse__Output>): grpc.ClientUnaryCall;
  deleteGame(argument: _DeleteRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_DeleteResponse__Output>): grpc.ClientUnaryCall;
  deleteGame(argument: _DeleteRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_DeleteResponse__Output>): grpc.ClientUnaryCall;
  deleteGame(argument: _DeleteRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_DeleteResponse__Output>): grpc.ClientUnaryCall;
  deleteGame(argument: _DeleteRequest, callback: grpc.requestCallback<_DeleteResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface GameHandlerHandlers extends grpc.UntypedServiceImplementation {
  CreateGame: grpc.handleUnaryCall<_CreateRequest__Output, _CreateResponse>;
  
  DeleteGame: grpc.handleUnaryCall<_DeleteRequest__Output, _DeleteResponse>;
  
}

export interface GameHandlerDefinition extends grpc.ServiceDefinition {
  CreateGame: MethodDefinition<_CreateRequest, _CreateResponse, _CreateRequest__Output, _CreateResponse__Output>
  DeleteGame: MethodDefinition<_DeleteRequest, _DeleteResponse, _DeleteRequest__Output, _DeleteResponse__Output>
}
