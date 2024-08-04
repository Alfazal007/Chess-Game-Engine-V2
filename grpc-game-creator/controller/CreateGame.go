package controller

import (
	"context"

	"github.com/grpc/game/internal/database"
)

func (apiCfg *ApiCfg) CreateNewGame(id string, player1 string, player2 string) bool {
	// check if player1 is part of a game, if yes end it and delete the game
	err := apiCfg.DB.FindExistingGameAndDelete(context.Background(), player1)
	if err != nil {
		return false
	}
	// check if player2 is part of a game, if yes end it and delete the game
	err = apiCfg.DB.FindExistingGameAndDelete(context.Background(), player2)
	if err != nil {
		return false
	}
	// create new game with the given players
	_, err = apiCfg.DB.CreateNewGame(context.Background(), database.CreateNewGameParams{
		ID:        id,
		Player1Id: player1,
		Player2Id: player2,
	})
	return err == nil
}
