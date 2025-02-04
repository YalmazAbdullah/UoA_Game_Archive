import argparse
import sqlite3
from datetime import datetime
from game import Game

def search_id(cursor:sqlite3.Cursor):
    # build and query
    id = input("Enter ID: ")
    cursor.execute("SELECT * FROM games WHERE id = ?", (id,))
    # fetch the results
    result = cursor.fetchone()
    if result == None:
        return None
    game = Game()
    game.build_from_query_result(result)
    print(game)
    return game

def search_name(cursor:sqlite3.Cursor):
    # build and query
    name = input("Enter name: ")
    cursor.execute("SELECT * FROM games WHERE name LIKE ?", ('%'+name+'%',))
    # fetch the results
    results = cursor.fetchall()
    if len(results) == 0:
        return None
    game = Game()
    for i in range(len(results)):
        game.build_from_query_result(results[i])
        results[i] = game
        print(results[i])
    return results

def search(cursor:sqlite3.Cursor):
    # build and query
    while True:
        choice = input("Search by ID or NAME? ").strip().upper()
        result = None
        if (choice == "ID"):
            result = search_id(cursor)
        elif (choice == "NAME"):
            result = search_name(cursor)
        else:
            print("Invalid choice.")
            continue
        if result == None:
            print("No matches found")
            continue
        break

def modify(cursor:sqlite3.Cursor):
    while True:
        game:Game = search_id(cursor)
        if game == None:
            print("No matches found")
            continue
        break
    options = list(game.mod_functions.keys())
    while True:
        target = input(f"Options are:{options}\nEnter field to edit: ").strip().lower()
        if target not in options:
            print("Invalid choice.")
            continue
        else:
            game.mod_functions[target]()
        cont = input("Make another change Y/N? ").strip().upper()
        if cont != "Y":
            break
    print(game)
    game.mod_in_db(cursor)

def remove(cursor:sqlite3.Cursor):
    while True:
        game:Game = search_id(cursor)
        if game == None:
            print("No matches found")
            continue
        game.remove_from_db(cursor)
        print("Removed the above!")
        cont = input("Remove another Y/N? ").strip().upper()
        if cont != "Y":
            break
        
def add_single(cursor:sqlite3.Cursor):
    new_entery = Game()
    while True:
        new_entery.populate_all()
        new_entery.add_to_db(cursor)
        cont = input("Add another game Y/N? ").strip().upper()
        if cont != "Y":
            break

class NoRepeatAction(argparse.Action):
    def __call__(self, parser, namespace, values, option_string=None):
        if getattr(namespace, self.dest, None) is not None:
            parser.error(f"Argument {option_string} cannot be repeated.")
        setattr(namespace, self.dest, values)

#######################
# MAIN                #
#######################
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
    commands.add_argument('-ac','--add_csv',action = 'store_const', help = 'add new games from csv file.')
    commands.add_argument('-b','--backup',  action = 'store_true', help = 'backup the archive. It will be stored in ./database/backups/')

    # take in and parse arguments
    args = parser.parse_args()

    # connect to databse
    con = sqlite3.connect("./database/archive.db")
    cursor = con.cursor()

    if(args.add == True):
        add_single(cursor)
    if(args.search == True):
        search(cursor)
    if(args.modify == True):
        modify(cursor)
    if(args.remove == True):
        remove(cursor)
    if(args.backup == True):
        timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        backup_con = sqlite3.connect(f"./database/backups/backups_{timestamp}.db")
        con.backup(backup_con)
        backup_con.close()

    # close databsae
    con.commit()
    con.close()
        
if __name__=="__main__":
    main()