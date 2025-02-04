import sqlite3
from fastapi import FastAPI, Query
from game import Game

app = FastAPI()

# connect to databse
con = sqlite3.connect("./backend/archive.db")
cursor = con.cursor()

# test ping: http://XYZ/?limit=10&page=0
@app.get("/")
async def get_games(limit: int = Query(10, ge=1), page: int = Query(0, ge=0)):
    cursor.execute("SELECT * FROM games LIMIT ? OFFSET ?", (limit,page*limit))
    results = cursor.fetchall()
    games = []
    for reult in results:
        game = Game()
        game.build_from_query_result(reult)
        games.append(game.to_json()) 
        
    return {
        "total": len(games),
        "limit": limit,
        "page": page,
        "games": games
    }