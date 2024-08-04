package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/chessv2dbupdater/controller"
	"github.com/chessv2dbupdater/internal/database"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/redis/go-redis/v9"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	portNumber := os.Getenv("PORT")
	if portNumber == "" {
		log.Fatal("There was an issue getting port number from the env variables")
	}

	dbUrl := os.Getenv("DB_URL")
	if dbUrl == "" {
		log.Fatal("Error getting database url from the env variables")
	}

	redisUrl := os.Getenv("REDIS_URL")
	if redisUrl == "" {
		log.Fatal("Error getting the redis url from the env variables")
	}

	conn, err := sql.Open("postgres", dbUrl)
	if err != nil {
		log.Fatal("Error opening database connection", err)
	}

	redis := redis.NewClient(&redis.Options{
		Addr:     redisUrl,
		Password: "",
		DB:       0,
	})

	apiCfg := controller.ApiCfg{
		DB:    database.New(conn),
		REDIS: redis,
	}
	// remove this lines
	fmt.Println(apiCfg.DB)

	// fmt.Println("Hello World!")
}
