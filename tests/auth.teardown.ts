import fs from 'fs';
import path from 'path';

async function authTeardown(){

    const allAuthFiles = [
        path.resolve('.auth', './normal_user.json'),
        path.resolve('.auth', './admin_user.json')
    ]

    console.log('Running the auth teardown - searching for auth files and removing them if having existed');
        for(const file of allAuthFiles){
            try{
                if(fs.existsSync(file)){
                    fs.rmSync(file);
                    console.log('The following auth file has been successfully deleted: ', file);
                }
            } catch(error){
                console.error('The following file could not be deleted: ', file)
            }
        }   
    }

export default authTeardown;

