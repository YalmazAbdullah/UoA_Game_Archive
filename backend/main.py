import sqlite3
from fastapi import FastAPI, Query, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from game import Game
from utlis import VALID_COURSES
from datetime import datetime
from typing import Optional

app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/thumbnails", StaticFiles(directory="thumbnails"), name="thumbnails")

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
async def get_games(limit: int = Query(12, ge=1), page: int = Query(0, ge=0), year: Optional[str] = Query(None), course: Optional[str] = Query(None)):
    # Convert 'null' strings to None
    query = "SELECT * FROM games"
    count_query = "SELECT COUNT(*) FROM games"
    additional = ""
    params = []

    year_int = int(year) if year and year.isdigit() else None
    
    if year and course:
        additional += " WHERE year = ? AND course = ?"
        params.extend([year, course])
    elif year:
        additional += " WHERE year = ?"
        params.append(year)
    elif course:
        additional += " WHERE course = ?"
        params.append(course)

    # Get total count
    cursor.execute(count_query+additional, params)
    total = cursor.fetchone()[0]

    query += additional+" LIMIT ? OFFSET ?"
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
        "total": total,
        "limit": limit,
        "page": page,
        "games": games
    }

# test ping: http://XYZ/filter_info?filter_name=year
@app.get("/random")
async def get_filters():
    cursor.execute("SELECT * FROM games ORDER BY RANDOM() LIMIT 1;")
    result = cursor.fetchone()
    game = Game()
    game.build_from_query_result(result)
    return game