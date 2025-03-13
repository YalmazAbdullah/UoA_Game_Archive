import sqlite3
from fastapi import FastAPI, Query, HTTPException
from game import Game
from utlis import VALID_COURSES
from datetime import datetime
from typing import Optional

app = FastAPI()

# connect to databse
con = sqlite3.connect("./archive.db")
cursor = con.cursor()

# test ping: http://XYZ/filter_info?filter_name=year
@app.get("/filter_info")
async def get_filters(filter_name: str = Query("year")):
    if filter_name == "year":
        return list (reversed(range(2010, datetime.today().year+1)))
    elif filter_name == "course":
        return VALID_COURSES
    else:
        raise HTTPException(status_code=400, detail="Invalid filter_name. Choose 'year' or 'course'.")
    
# test ping: http://XYZ/games?limit=12&page=0
@app.get("/games")
async def get_games(limit: int = Query(12, ge=1), page: int = Query(0, ge=0), year: Optional[int] = Query(None), course: Optional[str] = Query(None)):
    # Convert 'null' strings to None
    query = "SELECT * FROM games"
    params = []

    if year and course:
        query += " WHERE year = ? AND course = ?"
        params.extend([year, course])
    elif year:
        query += " WHERE year = ?"
        params.append(year)
    elif course:
        query += " WHERE course = ?"
        params.append(course)

    query += " LIMIT ? OFFSET ?"
    params.extend([limit, page * limit])

    print(query)
    print(params)
    cursor.execute(query, params)
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