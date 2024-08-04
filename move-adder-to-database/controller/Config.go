package controller

import (
	"github.com/chessv2dbupdater/internal/database"
	"github.com/redis/go-redis/v9"
)

type ApiCfg struct {
	DB    *database.Queries
	REDIS *redis.Client
}
