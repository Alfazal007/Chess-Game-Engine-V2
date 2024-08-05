import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { GameHandlerClient as _GameHandlerClient, GameHandlerDefinition as _GameHandlerDefinition } from './GameHandler';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  CreateRequest: MessageTypeDefinition
  CreateResponse: MessageTypeDefinition
  DeleteRequest: MessageTypeDefinition
  DeleteResponse: MessageTypeDefinition
  GameHandler: SubtypeConstructor<typeof grpc.Client, _GameHandlerClient> & { service: _GameHandlerDefinition }
}

