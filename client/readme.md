client-side readme
==================

The Node Web Cluster comes with a static file server for application assets, such as stylesheets (CSS) and Images (IMG), but the front-end application is wrapped by another server, that includes a powerful Core/Sandbox/Modules pattern, to create real-time web apps fully in client-side.

The client-side framework files are served in the ```ROOT/js directory```. For example, running locally in the 3000 port, you should call ```http://localhost:3000/js/your_file.js``` and place it in the ```client/``` folder.

#### Example:

	File in project: ```/client/app.js```
	File in webserver: ```/js/app.js``` 

#### Modules:

You should not edit the main app.js file, except the configuration classes. The file is well commented for guiding you through the config class.

You custom scripts should be created as separated modules in the ```client/modules.js``` file. Brunch minification in on the roadmap for this area.