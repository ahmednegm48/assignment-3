const http = require("node:http");
const fs = require('fs');
const PORT = 3000;
const data = fs.readFileSync('./users.json', 'utf8') ;
const jsonData = JSON.parse(data).users;


//___________________1__add user____________________//
const server = http.createServer((req, res) => {
    const { method, url } = req;
    if (method === 'POST' && url === '/user') {
        let newUser="";
        req.on('data', (chunk) => {
            newUser = JSON.parse(chunk.toString());
        });
        req.on('end', () => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            const emailExists = jsonData.some(
            (user) => user.email === newUser.email
          );
            if (!emailExists) {
                newUser.id = jsonData.length + 1;
                jsonData.push(newUser);
                            fs.writeFile('./users.json', JSON.stringify({ users: jsonData }, null, 2), (err) => {
                        if (err) throw err;
                    });
                res.end(JSON.stringify('File updated successfully!'));
            } else {
                res.end(JSON.stringify({ error: 'User with this email already exists' }));
            }
        });

//___________________2__update user____________________//

    }else if (method === 'PATCH' && url.startsWith("/user/")) {
        const id = req.url.split("/")[2];
        let updatedUser = "";
        req.on('data', (chunk) => {
            updatedUser = JSON.parse(chunk.toString());
        });
        req.on('end', () => {
            const userIndex = jsonData.findIndex((user) => user.id === parseInt(id));
            if (userIndex !== -1) {
                jsonData[userIndex] = { ...jsonData[userIndex], ...updatedUser };
                fs.writeFile('./users.json', JSON.stringify({ users: jsonData }, null, 2), (err) => {
                    if (err) throw err;
                });
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify('User updated successfully!'));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'User not found' }));
            }
        });

//___________________3__delete user____________________//

    }else if (method === 'DELETE' && url.startsWith("/user/")) {
        const id = req.url.split("/")[2];
        const userIndex = jsonData.findIndex((user) => user.id === parseInt(id));
        if (userIndex !== -1) {
            jsonData.splice(userIndex, 1);
            fs.writeFile('./users.json', JSON.stringify({ users: jsonData }, null, 2), (err) => {
                if (err) throw err;
            });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify('User deleted successfully!'));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'User not found' }));
        }


    //___________________4__get users____________________//
    
    
    }else if (method === 'GET' && url === '/user') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(jsonData));

    //___________________5__get user by id____________________//

    } else if (method === 'GET' && url.startsWith("/user/")) {
        const id = url.split("/")[2];
        const user = jsonData.find((u) => u.id === parseInt(id));
        if (user) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(user));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'User not found' }));
        }
    }


});

    
server.listen(PORT, 'localhost', () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});