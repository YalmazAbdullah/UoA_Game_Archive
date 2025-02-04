import sqlite3
from datetime import datetime
from pathlib import Path
from json import dumps,loads

VALID_COURSES = [
    "CMPUT250",
    "INTD450",
]

class Game:
    def __init__(self):
        self._id: int
        self._name: str
        self._course: str
        self._year: int
        self._blurb: str
        self._thumbnail: str
        self._releases: dict

        self.mod_functions = {
            "name":self.set_name,
            "course":self.set_course,
            "year":self.set_year,
            "blurb":self.set_blurb,
            "thumbnail":self.set_thumbnail,
            "releases":self.set_releases,
        }
    
    def set_name(self, name:str = None):
        if name == None:
            self._name = input("Name of game: ").strip()
        else: self._name = name.strip()

    def set_course(self, course_name:str = None):
        if course_name == None:
            course_name = input("Course code: ").strip()
        else: course_name.strip()
        course_name = course_name.upper()
        course_name = course_name.replace(" ","")
        if (course_name not in VALID_COURSES):
            raise ValueError(f'Invalid course code: {course_name}. Valid options are: {VALID_COURSES}')
        self._course =  course_name

    def set_year(self, year:int = None):
        if year == None:
            year = input("Year: ").strip()
        if year and year.isdigit():
            year = int(year)
            if int(year) <2000 or int(year) >datetime.now().year:
                raise ValueError(f'Invalid year: {str(year)}. Must be between 2000 and {str(datetime.now().year)}')
        self._year = year
    
    def set_blurb(self, blurb:str = None):
        if blurb == None:
            self._blurb = input("Blurb: ").strip()
        else: self._blurb = blurb.strip()

    def set_thumbnail(self, file_name:str = None):
        if file_name == None:
            file_name = input("Name of thubmnail file: ").strip()
        else: file_name.strip()
        path = "./database/thumbnails/"+file_name
        file = Path(path)
        if not file.exists():
            raise ValueError(f'Thumbnail file \"{file_name}\" does not exist in '
                             './database/thumnails/\nCheck if name is correct, '
                             'also  check if correct extension is included, ex: WithinVault.png')
        self._thumbnail = path

    def set_releases(self, releases:dict = None):
        if releases != None:
            # validate priovided release list
            for platform in releases.keys():
                if not releases[platform]:
                    raise ValueError(f"No link priovided for {platform}")
        else:
            # manually enter as many as desired
            releases = {}
            while True:
                # get info
                platform = input("platform: ")
                if not platform:
                    raise ValueError("No platform entered.")
                link = input("link: ")
                if not link:
                    raise ValueError("No link entered.")
                # TODO: ping test links
                # put in list
                releases[platform] = link
                # check if user wants to add more
                cont = input("Add another platform Y/N? ").strip().upper()
                if cont != "Y":
                    break
        self._releases = releases
    
    def populate_all(self):
        self.set_name()
        self.set_course()
        self.set_year()
        self.set_blurb()
        self.set_thumbnail()
        self.set_releases()

    def add_to_db(self, cursor):
        sql = "INSERT INTO games(name, course, year, blurb, thumbnail, releases) VALUES(?,?,?,?,?,?)"
        cursor.execute(sql, (
            self._name, self._course, self._year, self._blurb, self._thumbnail, dumps(self._releases)
        ))

    def mod_in_db(self, cursor:sqlite3.Cursor):
        sql = "UPDATE games SET name = ?, course = ?, year = ?, blurb = ?, thumbnail = ?, releases = ? WHERE id = ?"
        cursor.execute(sql, (
            self._name, self._course, self._year, self._blurb, self._thumbnail, dumps(self._releases), self._id
        ))
    
    def remove_from_db(self, cursor:sqlite3.Cursor):
        sql = "DELETE FROM games WHERE id = ?"
        cursor.execute(sql, (self._id,))
    
    def build_from_query_result(self, result):
        self._id = result[0]
        self._name = result[1]
        self._course = result[2]
        self._year = result[3]
        self._blurb = result[4]
        self._thumbnail = result[5]
        self._releases = result[6]

    def to_json(self):
        return {
            "id":self._id,
            "name":self._name,
            "course":self._course,
            "year":self._year,
            "blurb":self._blurb,
            "thumbnail":self._thumbnail,
            "releases":loads(self._releases)
        }
    
    def __repr__(self): 
        return (f'ID:{self._id:<14} NAME:{self._name}\n'
        f'COURSE:{self._course:<10} YEAR:{self._year}\n'
        f'BLURB:{self._blurb}\n'
        f'THUMBNAIL:{self._thumbnail}\n'
        f'RELEASES:{self._releases}')