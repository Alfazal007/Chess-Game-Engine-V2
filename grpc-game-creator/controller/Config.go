package controller

import "github.com/grpc/game/internal/database"

type ApiCfg struct {
	DB *database.Queries
}
