import os
import sqlite3
import urllib.request
from datetime import datetime
from pathlib import Path
from json import dumps,loads
from utlis import VALID_COURSES
from dotenv import load_dotenv

def check_url(url: str):
    with urllib.request.urlopen(url) as response:
        if response.status == 200:
            return True
        else:
            return False
        
class Game:
    def __init__(self):
        self._id: int
        self._name: str
        self._course: str
        self._year: int
        self._team: dict
        self._blurb: str
        self._thumbnail: str
        self._releases: dict

        self.mod_functions = {
            "name":self.set_name,
            "course":self.set_course,
            "year":self.set_year,
            "team":self.set_team,
            "blurb":self.set_blurb,
            "thumbnail":self.set_thumbnail,
            "releases":self.set_releases,
        }
    
    ################################
    #           SETTERS            #
    ################################
    def set_name(self, name:str = None):
        '''
        Validate and set name.
        
        Parameters:
        ----------
        name (str): Title of the game, validated to make sure it is not empty and not bigger than 50 charachters.
        '''
        if name == None:
            name = input("Name of game: ").strip()
            if (name == None or len(name)>=50):
                raise ValueError(f'Error: Missing or Invalid Name: {name}. Must be under 50 charachters.')
            else:
                self._name = name
        else: self._name = name.strip()

    def set_course(self, course_code:str = None):
        '''
        Clean, Validate and set course code that the game was made in. It performs basic clean up such as that all 
        codes are CAPS, have no spaces or dashes. It then checks if the courses are in the list of valid courses.  
        
        Parameters:
        ----------
        course_code (str): Code for the course this game was made in.
        '''
        if course_code == None:
            course_code = input("Course code: ").strip()
        else: course_code.strip()
        course_code = course_code.upper()
        course_code = course_code.replace(" ","")
        course_code = course_code.replace("-","")
        if (course_code not in VALID_COURSES):
            raise ValueError(f'Error: Invalid course code: {course_code}. Valid options are: {VALID_COURSES}.')
        self._course =  course_code

    def set_year(self, year:int = None):
        '''
        Validates and set the date. A valid date is an int between year 2000 and now.
        
        Parameters:
        ----------
        year (int): Year this game was made in.
        '''
        if year == None:
            year = input("Year: ").strip()
            if year.isdigit():
                year = int(year)
            else:
                raise ValueError(f'Error: Invalid year. Not a digit.')
        if year:
            if int(year) <2000 or int(year) >datetime.now().year:
                raise ValueError(f'Error: Invalid year: {str(year)}. Must be between 2000 and {str(datetime.now().year)}.')
        self._year = year

    def set_team(self, team:dict = None):
        '''
        Set team details. The members and roles.
        
        Parameters:
        ----------
        year (dict): Key is the member name, value is the role.
        '''
        if team != None:
            # validate provided dict.
            for member in team:
                if member == None:
                    raise ValueError("Error: Missing role.")
        else:
            # manually enter as many as desired
            team = {}
            while True:
                # get info
                member = input("member: ")
                if member == None:
                    raise ValueError("Error: No member name entered.")
                role = input("role: ")
                if role == None:
                    raise ValueError("Error: No role name entered.")
                
                # create entery
                team[member] = role
                # check if user wants to add more
                cont = input("Add another platform Y/N? ").strip().upper()
                if cont != "Y":
                    break
        self._team = team

    def set_blurb(self, blurb:str = None):
        '''
        Set the bulrb, a breif description of the game.
        
        Parameters:
        ----------
        blurb (str): Short blurb that is under 500 charachters long Ideally 250.
        '''
        if blurb == None:
            blurb = input("Blurb: ").strip()
            if (blurb == None or len(blurb)>=50):
                raise ValueError(f'Error: Missing or Invalid Blurb: {blurb}. Must be under 500 charachters. Ideally 250.')
            else:
                self._blurb = blurb
        else: self._blurb = blurb.strip()

    def set_thumbnail(self, file_name:str = None):
        '''
        Sets the name of thumbnail file. Validates by checking if this file actually exists
        
        Parameters:
        ----------
        file_name (str): Name of thumbnail file. Must match an actual file in the thumbnails folder.
        '''
        if file_name == None:
            file_name = input("Name of thubmnail file: ").strip()
        else: file_name.strip()
        path = "thumbnails/"+file_name
        file = Path(path)
        if not file.exists():
            raise ValueError(f'Error: Thumbnail file \"{file_name}\" does not exist in ./thumbnails/\n'
                             'Check if:\n'
                             '- name is correct\n'
                             '- correct extension is included, ex: WithinVault.png\n')
        self._thumbnail = path

    def set_releases(self, releases:dict = None):
        '''
        Sets release platforms. Validates by checking if the links provided actually work
        
        Parameters:
        ----------
        releases (dict): Name of thumbnail file. Must match an actual file in the thumbnails folder.
        '''
        if releases != None:
            # validate priovided release dict
            for release in releases:
                if not check_url(releases[release]):
                    raise ValueError("Error: Link failed ping test.")
            for platform in releases.keys():
                if not releases[platform]:
                    raise ValueError(f"Error: No link priovided for {platform}")
        else:
            # manually enter as many as desired
            releases = {}
            while True:
                # get info
                platform = input("platform: ")
                if not platform:
                    raise ValueError("Error: No platform entered.")
                link = input("link: ")
                if not link:
                    raise ValueError("Error: No link entered.")
                if not check_url(link):
                    raise ValueError("Error: Link failed ping test.")
                releases[platform] = link
                # check if user wants to add more
                cont = input("Add another platform Y/N? ").strip().upper()
                if cont != "Y":
                    break
        self._releases = releases

    ################################
    #           METHODS            #
    ################################

    def __repr__(self): 
        return (f'ID:{self._id:<14} NAME:{self._name}\n'
        f'COURSE:{self._course:<10} YEAR:{self._year}\n'
        f'TEAM:{self._team}\n'
        f'BLURB:{self._blurb}\n'
        f'THUMBNAIL:{self._thumbnail}\n'
        f'RELEASES:{self._releases}')

    def populate_all(self):
        '''
        Calls all set functions. Used to set up manualy entery for a game.
        '''
        self.set_name()
        self.set_course()
        self.set_year()
        self.set_team()
        self.set_blurb()
        self.set_thumbnail()
        self.set_releases()


    def add_to_db(self, cursor:sqlite3.Cursor):
        '''
        Flushes the properties to database.
        
        Parameters:
        ----------
        cursor (sqlite3.Cursor): Write position for the database.
        '''
        sql = "INSERT OR REPLACE INTO games(name, course, year, team, blurb, thumbnail, releases) VALUES(?,?,?,?,?,?,?)"
        cursor.execute(sql, (
            self._name, self._course, self._year, dumps(self._team), self._blurb, self._thumbnail, dumps(self._releases)
        ))

    def mod_in_db(self, cursor:sqlite3.Cursor):
        '''
        Overwrites existing entery in database with modified data.
        
        Parameters:
        ----------
        cursor (sqlite3.Cursor): Write position for the database.
        '''
        sql = "UPDATE games SET name = ?, course = ?, year = ?, blurb = ?, thumbnail = ?, releases = ? WHERE id = ?"
        cursor.execute(sql, (
            self._name, self._course, self._year, dumps(self._team), self._blurb, self._thumbnail, dumps(self._releases), self._id
        ))

    def remove_from_db(self, cursor:sqlite3.Cursor):
        '''
        Remove entery from database.
        
        Parameters:
        ----------
        cursor (sqlite3.Cursor): Write position for the database.
        '''
        sql = "DELETE FROM games WHERE id = ?"
        cursor.execute(sql, (self._id,))

    def populate_from_query_result(self, result):
        '''
        Populate attributes from database query result.
        
        Parameters:
        ----------
        result: Database query result.
        '''
        self._id = result[0]
        self._name = result[1]
        self._course = result[2]
        self._year = result[3]
        self._team = result[4]
        self._blurb = result[5]
        self._thumbnail = result[6]
        self._releases = result[7]
    
    def to_json(self):
        '''
        Conver.
        
        Parameters:
        ----------
        cursor: Write position for the database.
        '''
        env_path = Path('..') / '.env'
        load_dotenv(env_path)
        api_url = os.getenv('VITE_API_URL')
        return {
            "id":self._id,
            "name":self._name,
            "course":self._course,
            "year":self._year,
            "team":loads(self._team),
            "blurb":self._blurb,
            "thumbnail":api_url + "/" + self._thumbnail,
            "releases":loads(self._releases)
        }