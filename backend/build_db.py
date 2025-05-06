import sqlite3

def main():
    # Create SQLite database and table
    conn = sqlite3.connect("./archive.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS games(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            course TEXT NOT NULL,
            year  INT NOT NULL,
            team TEXT NOT NULL,
            blurb TEXT NOT NULL,
            thumbnail TEXT NOT NULL,
            releases TEXT NOT NULL
        )
    """)
    conn.commit()

if __name__=="__main__":
    main()