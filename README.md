Hey Fellow Developers,
let me guide you on how to work on this project:

Div.
the demo-form.html is a testing file you can make what you want with it (not important)

Backend.
it's a nestJS with a connection to a mongoDB, the purpose is to run a cypress tests on it
you can deploy it with: ``docker-compose -f docker-compose.yml up --build -d``
and you can deploy in localhost with: ``docker-compose -f docker-compose.dev.yml up --build``
it need an env file with the following variables:
```DATABASE_GUI_USER
DATABASE_GUI_PASSWORD
DATABASE_NAME
DATABASE_HOST
DATABASE_PORT
DOMAIN```

Extension.
it's a webExtenstion made for firefox, it contain three parts, the popup menu, the injected script and the background script
you can build it using webpack with: 
prod all: ``npm run build-prod``
dev popup: ``npm run build-popup``
dev injected: ``npm run build-testMenu``
if can then import the manifest.json in firefox
if you want to make a release you can make a zip (rename to xpi) after building containing the manifest.json, testMenu, popup, background, assets and icons directories

MongoDB.
there is a container with a webGUI at 8081 port


```Extensions details```
the background script is used as a way of storing informations across websites,
you can use the function sendToBackground() that take an object containing en event field and then what you want

the popup script is used to display the main menu of the extension, it's an simple html js page
the webpack build inject the html and css file in it to make it easier to work on it

the injected script is the more dense part, it's the menu in the website where you create the test
it's the more spaguetti part of the code, it contain more js files,
the testMenu file is the entrypoint, nothing more
the utils.js file is a milesceanous file that contain notably the functions for the css-selector
the html.js file contain the heart of the testMenu, there you call every init functions and you manage at macro state
the initItem.js file contain all the functions bound to an element in the testMenu, it's the most important file,
i tried to keep it as simple as possible


```Backend details```
the backend is a basic nestJS config, almost everything is contained in the cypress module/folder
you can find in the cypress controller the routes related to the cypress tests
you can find in the cypress service the core of the system, it make the link with the db but also run the serializer before runing the cypress
the serializer is the part that convert the json of the test stored in the db and sended by the webExtension to a cypress .cy.js test file
the serializer is stored in the converter.js file