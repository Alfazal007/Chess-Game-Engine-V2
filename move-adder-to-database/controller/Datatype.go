package controller

type IncomingData struct {
	TypeOfInformation string `json:"typeOfInformation"`
	From              string `json:"from"`
	To                string `json:"to"`
	GameId            string `json:"gameId"`
	Color             string `json:"color"`
	Timestamp         string `json:"timestamp"`
}
