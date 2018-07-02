Worked environment 

**node**: 8.9.4

**nw.js**: 0.24.4-sdk

**Indications**

1- Has a problem in byteballcore/conf.js file. The following code gives an error
as "Error: Cannot find module /home/user/project_folder/package.json".

	var appRootDir = desktopApp.getAppRootDir();
	var appPackageJson = require(appRootDir + '/package.json');
	
This was realized that when _byteballcore_ is bundled the `require` method is replaced
with `__webpack_require__` located in main...js bundle.

After that, This was tested: byteballcore ignored from bundle to make chunk independently via adding "`new IgnorePlugin(/.*byteballcore.*/)`" into webpack.common.js. 
At this time,byteballcore could not seen as a module. And gave errors like this:
"Cannot find module 'byteballcore/constants.js'".

It is thinkable that to change byteballcore code.
