package controller

import (
	"context"
	"fmt"

	"github.com/grpc/game/internal/database"
)

// here the parameters are the users' emails
func (apiCfg *ApiCfg) CreateNewGame(id string, player1 string, player2 string) bool {

	// get user1 id
	user1, err := apiCfg.DB.IdFromEmailUser(context.Background(), player1)
	if err != nil {
		return false
	}
	user2, err := apiCfg.DB.IdFromEmailUser(context.Background(), player2)
	if err != nil {
		return false
	}

	err = apiCfg.DB.DeleteMoves(context.Background(), "%"+user1.Email+"%")
	if err != nil {
		return false
	}
	err = apiCfg.DB.DeleteMoves(context.Background(), "%"+user2.Email+"%")
	if err != nil {
		return false
	}
	// check if player1 is part of a game, if yes end it and delete the game
	err = apiCfg.DB.FindExistingGameAndDelete(context.Background(), user1.ID)
	if err != nil {
		fmt.Println(err)
		return false
	}
	// check if player2 is part of a game, if yes end it and delete the game
	err = apiCfg.DB.FindExistingGameAndDelete(context.Background(), user2.ID)
	if err != nil {
		return false
	}
	// create new game with the given players
	_, err = apiCfg.DB.CreateNewGame(context.Background(), database.CreateNewGameParams{
		ID:        id,
		Player1Id: user1.ID,
		Player2Id: user2.ID,
	})
	return err == nil
}
