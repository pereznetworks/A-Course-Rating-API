// require modules
const fs = require('fs');
const util = require('util');

// method to check for a ../data folder, if none, create one
const checkForFolder = function(pathtoDataFolder){

      // variables
      const defaultFolderPath = 'data';
      let dataFolder = defaultFolderPath;
      // if path to data folder IS specified, use it, if not use default data folder path
       if (pathtoDataFolder){
        dataFolder = pathtoDataFolder;
       }
      // makes dir, if already exist send error: EEXIST
      // will create entire path to dest folder
      fs.mkdir(dataFolder, { recursive: true }, (err) => {
        if (err) console.log(err);
      });

    };// end checkforDataFolder()

module.exports.checkForFolder = checkForFolder;
