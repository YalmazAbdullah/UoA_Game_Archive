import argparse
import sqlite3
from datetime import datetime
from game import Game
import csv
from json import loads

class NoRepeatAction(argparse.Action):
    def __call__(self, parser, namespace, values, option_string=None):
        if getattr(namespace, self.dest, None) is not None:
            parser.error(f"Argument {option_string} cannot be repeated.")
        setattr(namespace, self.dest, values)

################################
#            SEARCH            #
################################
def search_id(cursor:sqlite3.Cursor):
    '''
    Search the database using ID.

    Parameters:
    ----------
    cursor (sqlite3.Cursor): Write position for the database.
    '''
    # build and query
    id = input("Enter ID: ")
    cursor.execute("SELECT * FROM games WHERE id = ?", (id,))
    # fetch the results
    result = cursor.fetchone()
    if result == None:
        return None
    game = Game()
    game.populate_from_query_result(result)
    print(game)
    return game

def search_name(cursor:sqlite3.Cursor):
    '''
    Search the database using Name.

    Parameters:
    ----------
    cursor (sqlite3.Cursor): Write position for the database.
    '''
    # build and query
    name = input("Enter name: ")
    cursor.execute("SELECT * FROM games WHERE name LIKE ?", ('%'+name+'%',))
    # fetch the results
    results = cursor.fetchall()
    if len(results) == 0:
        return None
    game = Game()
    for i in range(len(results)):
        game.populate_from_query_result(results[i])
        results[i] = game
        print(results[i])
    return results

def search(cursor:sqlite3.Cursor):
    '''
    Generic search function that warps around Name and ID search.

    Parameters:
    ----------
    cursor (sqlite3.Cursor): Write position for the database.
    '''
    while True:
        choice = input("Search by ID or NAME? ").strip().upper()
        result = None
        if (choice == "ID"):
            result = search_id(cursor)
        elif (choice == "NAME"):
            result = search_name(cursor)
        else:
            print("Error: Invalid choice.")
            continue
        if result == None:
            print("Error: No matches found")
            continue
        break

################################
#             ADD              #
################################
def add_single(cursor:sqlite3.Cursor):
    '''
    Add entery manually, one by one.

    Parameters:
    ----------
    cursor (sqlite3.Cursor): Write position for the database.
    '''
    new_entery = Game()
    while True:
        new_entery.populate_all()
        new_entery.add_to_db(cursor)
        cont = input("Add another game Y/N? ").strip().upper()
        if cont != "Y":
            break

def add_many(con:sqlite3.Connection, cursor:sqlite3.Cursor, path):
    '''
    Add a multiple enteries from a CSV.

    Parameters:
    ----------
    con (sqlite3.Connection): Connection with database.
    cursor (sqlite3.Cursor): Write position for the database.
    '''
    try:
        # Read CSV
        with open(path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            
            for row in reader:
                # Attempt to create instance
                game = Game()
                try:
                    game.set_name(row["name"])
                    game.set_course(row["course"])
                    game.set_year(int(row["year"]))
                    game.set_team(loads(row["team"].replace("'", '"')))  
                    game.set_blurb(row["blurb"])
                    game.set_thumbnail(row["thumbnail"])
                    game.set_releases(loads(row["releases"].replace("'", '"')))  
                except Exception as e:
                    print(f"Error: Failed to parse entry for {row['name']}")
                    print(f"---->{e}")
                    break
                
                # Attempt to write in db
                try:
                    game.add_to_db(cursor)
                except Exception as e:
                    print(f"Error: Failed to add {row["name"]} to database.")
                    print(f"---->{e}")
                    print("Please resolve issues before retrying.")
                    con.rollback
                    break

                # Add to completed list
                print(f"✅ Success: {row['name']} processed.")

    except FileNotFoundError:
        print(f"Error: CSV file '{path}' not found.")
        return
    return

################################
#            MODIFY            #
################################

def modify(cursor:sqlite3.Cursor):
    '''
    Modify enteries in database.

    Parameters:
    ----------
    cursor (sqlite3.Cursor): Write position for the database.
    '''
    # Find game to be modified
    while True:
        game:Game = search_id(cursor)
        if game == None:
            print("Error: No matches found")
            continue
        break

    # List options
    options = list(game.mod_functions.keys())

    # Select options and entery new value
    while True:
        target = input(f"Options are:{options}\nEnter field to edit: ").strip().lower()
        if target not in options:
            print("Error: Invalid choice.")
            continue
        else:
            game.mod_functions[target]()
        cont = input("Make another change Y/N? ").strip().upper()
        if cont != "Y":
            break

    # Print updated entery and apply
    print(game)
    game.mod_in_db(cursor)

################################
#            REMOVE            #
################################

def remove(cursor:sqlite3.Cursor):
    '''
    Remove entery from database.

    Parameters:
    ----------
    cursor (sqlite3.Cursor): Write position for the database.
    '''
    while True:
        game:Game = search_id(cursor)
        if game == None:
            print("Error: No matches found")
            continue
        game.remove_from_db(cursor)
        print("✅ Success: Game Removed.")
        cont = input("Remove another Y/N? ").strip().upper()
        if cont != "Y":
            break

################################
#             MAIN             #
################################

def main():
    # set up arguments
    parser = argparse.ArgumentParser(
        prog = 'Update Database Tool',
        description='A simple tool that allows updating the game archive\
            database. It also allows for the creation of backups',            
    )
    commands = parser.add_mutually_exclusive_group()
    commands.add_argument('-a','--add',     action = 'store_true', help = 'add a new game.')
    commands.add_argument('-s','--search',  action = 'store_true', help = 'search game IDs with provided string in name.')
    commands.add_argument('-m','--modify',  action = 'store_true', help = 'modify an existing game.')
    commands.add_argument('-r','--remove',  action = 'store_true', help = 'remove an existing game.')
    commands.add_argument('-b','--backup',  action = 'store_true', help = 'backup the archive. It will be stored in ./backups/')
    commands.add_argument('-am', '--add-many', type=str, metavar="CSV_PATH", help='add multiple games from a CSV file.')

    # take in and parse arguments
    args = parser.parse_args()

    # connect to databse
    con = sqlite3.connect("./archive.db")
    cursor = con.cursor()

    if(args.add == True):
        add_single(cursor)
    if args.add_many:
        add_many(con, cursor, args.add_many)
    if(args.search == True):
        search(cursor)
    if(args.modify == True):
        modify(cursor)
    if(args.remove == True):
        remove(cursor)
    if(args.backup == True):
        timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        backup_con = sqlite3.connect(f"./backups/backup_{timestamp}.db")
        con.backup(backup_con)
        backup_con.close()

    # close databsae
    con.commit()
    con.close()
        
if __name__=="__main__":
    main()