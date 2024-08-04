package main

import (
	"context"
	"database/sql"
	"log"
	"net"
	"os"

	"github.com/grpc/game/controller"
	create_game "github.com/grpc/game/create-game"
	"github.com/grpc/game/internal/database"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"google.golang.org/grpc"
)

var apiCfg controller.ApiCfg

type myGameServer struct {
	create_game.UnimplementedGameHandlerServer
}

func (s *myGameServer) CreateGame(ctx context.Context, req *create_game.CreateRequest) (*create_game.CreateResponse, error) {
	// add the logic to create a new game here
	res := apiCfg.CreateNewGame(req.Id, req.PlayerId1, req.PlayerId2)
	return &create_game.CreateResponse{
		Created: res,
	}, nil
}

func (s *myGameServer) DeleteGame(ctx context.Context, req *create_game.DeleteRequest) (*create_game.DeleteResponse, error) {
	// add the logic to delete the game
	res := apiCfg.DeleteGame(req.Id)
	return &create_game.DeleteResponse{
		Deleted: res,
	}, nil
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	portNumber := os.Getenv("PORT")
	if portNumber == "" {
		log.Fatal("Error getting port number from the env variables")
	}
	dbUrl := os.Getenv("DB_URL")
	if dbUrl == "" {
		log.Fatal("Error getting database url from the env variables")
	}
	conn, err := sql.Open("postgres", dbUrl)
	if err != nil {
		log.Fatal("Error opening database connection", err)
	}
	apiCfg = controller.ApiCfg{DB: database.New(conn)}

	lis, err := net.Listen("tcp", ":"+portNumber)
	if err != nil {
		log.Fatalf("cannot create listener: %s", err)
	}
	serverRegistrar := grpc.NewServer()
	service := &myGameServer{}
	create_game.RegisterGameHandlerServer(serverRegistrar, service)
	err = serverRegistrar.Serve(lis)
	if err != nil {
		log.Fatalf("impossible to serve: %s", err)
	}
}
