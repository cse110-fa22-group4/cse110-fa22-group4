const childProcess = require('child_process');

async function resetSongs(user) {
    let source_dir, destination_dir;
    if (user == 'user1'){
        source_dir  = '../users/user_reset/user_1/songs';
        destination_dir = '../users/user_1/songs';
    }
    else if (user == 'user2') {
        source_dir = '../users/user_reset/user_2/songs';
        destination_dir = '../users/user_2/songs';
    }
    childProcess.spawnSync('robocopy'
       , [source_dir, destination_dir ,'/E'],
        {encoding: "utf-8"});
}




module.exports = {
    resetSongs,
};