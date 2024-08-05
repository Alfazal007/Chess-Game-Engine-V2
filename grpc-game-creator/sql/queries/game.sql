-- name: CreateNewGame :one
INSERT INTO "Game" ("id", "player1Id" , "player2Id" ) values ($1, $2, $3) returning *;

-- name: FindExistingGameAndDelete :exec
DELETE FROM "Game" where "player1Id"=$1 OR "player2Id"=$1;

-- name: DeleteACompletedGame :exec
DELETE FROM "Game" where "id"=$1;

-- name: IdFromEmailUser :one
SELECT * FROM "User" where "email"=$1;
