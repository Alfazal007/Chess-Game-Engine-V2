// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.26.0
// source: game.sql

package database

import (
	"context"
)

const createNewGame = `-- name: CreateNewGame :one
INSERT INTO "Game" ("id", "player1Id" , "player2Id" ) values ($1, $2, $3) returning id, "player1Id", "player2Id"
`

type CreateNewGameParams struct {
	ID        string
	Player1Id string
	Player2Id string
}

func (q *Queries) CreateNewGame(ctx context.Context, arg CreateNewGameParams) (Game, error) {
	row := q.db.QueryRowContext(ctx, createNewGame, arg.ID, arg.Player1Id, arg.Player2Id)
	var i Game
	err := row.Scan(&i.ID, &i.Player1Id, &i.Player2Id)
	return i, err
}

const deleteACompletedGame = `-- name: DeleteACompletedGame :exec
DELETE FROM "Game" where "id"=$1
`

func (q *Queries) DeleteACompletedGame(ctx context.Context, id string) error {
	_, err := q.db.ExecContext(ctx, deleteACompletedGame, id)
	return err
}

const findExistingGameAndDelete = `-- name: FindExistingGameAndDelete :exec
DELETE FROM "Game" where "player1Id"=$1 OR "player2Id"=$1
`

func (q *Queries) FindExistingGameAndDelete(ctx context.Context, player1id string) error {
	_, err := q.db.ExecContext(ctx, findExistingGameAndDelete, player1id)
	return err
}
