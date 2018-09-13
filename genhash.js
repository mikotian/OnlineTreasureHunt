var fs=require('fs');
const bcrypt = require('bcrypt-nodejs');

var pwdfile=fs.readFileSync('rawpwd.txt');

var rawpwds=pwdfile.toString().split('\n');



rawpwds.forEach(element=>{
		const salt = bcrypt.genSaltSync();
            const hash = bcrypt.hashSync(element.trim(), salt);
	console.log(hash);
	});
