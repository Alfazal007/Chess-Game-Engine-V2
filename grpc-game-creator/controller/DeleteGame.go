package controller

import (
	"context"
)

func (apiCfg *ApiCfg) DeleteGame(id string) bool {
	err := apiCfg.DB.DeleteACompletedGame(context.Background(), id)
	return err == nil
}
