import * as hashIds from '../../middleware/hashIds.js';

for(var i = 0; i < 10; i++)
    console.log(hashIds.newUserId());

    for(var i = 0; i < 10; i++)
    console.log(hashIds.newPostHash());