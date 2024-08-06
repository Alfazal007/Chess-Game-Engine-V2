-- name: AddMove :one
INSERT INTO "Move" ("id", "from" , "to", "timeStamp", "gameId", "color" ) values ($1, $2, $3, $4, $5, $6) returning *;
