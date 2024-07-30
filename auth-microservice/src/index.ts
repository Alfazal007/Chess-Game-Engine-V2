import { app } from "./app";
import { configDotenv } from "dotenv";

configDotenv({ path: ".env" });

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
