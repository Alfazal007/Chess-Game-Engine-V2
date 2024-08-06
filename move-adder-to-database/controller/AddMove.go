package controller

import (
	"context"
	"log"

	"github.com/chessv2dbupdater/internal/database"
	"github.com/google/uuid"
)

func (apiCfg *ApiCfg) AddMove(dataInsert IncomingData) bool {
	if dataInsert.Color == "" || dataInsert.From == "" || dataInsert.GameId == "" || dataInsert.Timestamp == "" || dataInsert.To == "" || dataInsert.TypeOfInformation == "" {
		return false
	}
	log.Println("Here")
	// add move to the database
	_, err := apiCfg.DB.AddMove(context.Background(), database.AddMoveParams{
		ID:        uuid.New().String(),
		From:      dataInsert.From,
		To:        dataInsert.To,
		TimeStamp: dataInsert.Timestamp,
		GameId:    dataInsert.GameId,
		Color:     dataInsert.Color,
	})
	log.Println(err)
	return err == nil
}
