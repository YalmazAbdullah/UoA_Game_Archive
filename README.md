# About
Source code for the UAlberta game archive. Includes a tool for updaing and backing up the database. Documentation for this tool provided below.

# IMPORTANT NOTE:
Before proceeding with anything else the enviorment needs to be configured. Create a `.env` file in the root of this project. Then add the following line.
```
VITE_API_URL = http://localhost:8000
```
When deploying the website change localhost to the actual URL.

# Website Documentation
Backend code including the REST API are contained within the `./backend` folder. Front end code is in the root. Backend is built with FastAPI. Frontend is built with Vite+React+Tailwind+ShadCN.

**Requirements**
```
python version - 3.12.3
node version - v22.14.0
npm version - 10.9.2
react version - 19.1.
```
## Launching on Localhost
### Backend:
(in root of the project)
```
cd ./backend
python -m venv ./venv
source venv/bin/activate
pip install -r requirements.txt
fastapi dev main.py
```
Creates and activates python virtual enviorment. Installs required dependencies for backend. Lanches the back end in dev mode. 

A test database is currently provided however to create a new one delete the existing `backend/archive.db` file. and run the following command.
```
python build_db.py
```
this will create a new empty databse.

### Frontend:
(in root of the project)

make sure node and npm are installed
```
node --version
npm --version
```
if not then install instructions are available [here](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating).

create a `.env ` file to store enviorment variable in root. Paste the following line
```
VITE_API_URL = http://localhost:8000
```

if they are then use the following command to launch in dev mode on localhost.
```
npm install
npm run dev
```
# Data Specification
This section outlines the expectations around data when adding a game entery to the database, manually or through csv.

- **Name:** Name of games are expected to be **under 25 charachters** if they are to show cleanly on the cards. Otherwise they will get cropped with '...' at the end. It will still show in full inside the modal that appears when a card is clicked.

- **Course:** Code of the course this game was made in. Must be one of the game dev cert courses as specified in `backend/utils.py`

- **Year:** Can be any year between 2010 and present year.

- **Team:** All team members and their roles. In the csv this is formated as a dictionary where the member's names are the key and role is the value.

- **Blurb:** A short description of the game. Max 500 charachters long, ideally 250 charachters to fit cleanly in the card.

- **Thumbnail:** Name of thumbnail file. The actual thumbnail image should have a matching name and be placed in the `backend/thumbnails/` folder. Though images of any size or aspect ratio will work, to avoid stretching or cropping I recommend 920 x 430. Some images are already in the folder for testing purposes.

- **Releases:** All the release platforms for the game. In the csv this is formatted as a dictionary with platform name as the key and a link as the value. The links will be validated upon entery to see if they work. A list of valid platforms is available in `backend/utils.py`
  
A sample csv file is provided titles `_test.csv` for reference of how the csv file should be structred. 

# CLI Tool Documentation
The CLI tool is to easily maintain and back up the archive's database. 

**Requirements**
```
python version - 3.12.3
```
if all python dependencies have not already been installed then use the following commands:
```
cd ./backend
python -m venv ./venv
source venv/bin/activate
pip install -r requirements.txt
```
This will create a virtual enviorment, activate it and install all dependencies. For use in the future first navigate to `backend/` and then activate the virtual enviroment with:
```
source venv/bin/activate
```
Then use the tool using:
```
python tool.py [FLAG HERE]
```
The following flags are available:
```
  -h, --help            show this help message and exit
  -a, --add             add a new game.
  -s, --search          search game IDs with provided string in name.
  -m, --modify          modify an existing game.
  -r, --remove          remove an existing game.
  -b, --backup          backup the archive. It will be stored in ./backups/
  -am CSV_PATH,         add multiple games from a CSV file.
```

## Creating a New Entery or Modify Existing:
The easiest way to make multiple changes is through csv. If a game with the same name is detected it will simply update the entery in the database instead of making a new entery.

For testing purposes a `_test.csv` is provided. This containes dummy data used to test the website and can be added to the database using
```
python tool.py _test.csv
```

Manual additions or modifications can be done through
```
python tool.py -a //to add
or 
python tool.py -m //to modify
```
notes:
- modal not spanning full width 1920p
- height of cards too big
- switch team and description position for modal so more words can fit






