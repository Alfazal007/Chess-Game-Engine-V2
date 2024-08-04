-- name: CreateNewGame :one
INSERT INTO "Game" ("id", "player1Id" , "player2Id" ) values ($1, $2, $3) returning *;
