var allLoginUsers = {};

module.exports = (function (io) {
    io.of('/chat').
    on('connection', function (socket) {
        var role = (socket.handshake.headers.referer.indexOf("admin") > -1) ? 'admin' : 'user';
        var name = (socket.handshake.headers.referer.indexOf("admin") > -1) ? 'Admin' : 'User';
        var newUser = {id: socket.client.id, role : role, name : name};
        allLoginUsers[socket.client.id] = newUser;

        if (role == 'admin') {
            clients = io.of('/chat').clients();
            conClients = clients.connected
            for (var p in conClients) {
                if (allLoginUsers[conClients[p].client.id]['role'] == 'admin') {
                    conClients[p].emit('usersList', {allLoginUsers : allLoginUsers, thisId : conClients[p].client.id});
                }
            }
        }

        socket.on('setusername', function (name) {
            allLoginUsers[socket.client.id]['name'] = name;
            clients = io.of('/chat').clients();
            conClients = clients.connected
            var adminIsConnected = false;
            var myNewUser = false;
            for (var p in conClients) {
                if (allLoginUsers[conClients[p].client.id]['role'] == 'admin') {
                    conClients[p].emit('usersList', {allLoginUsers : allLoginUsers, thisId : conClients[p].client.id});
                    adminIsConnected = true;
                }
                if (conClients[p].client.id == socket.client.id) {
                    myNewUser = conClients[p]
                }
            }
            if (myNewUser) {
                newUser.isAdminConnected = adminIsConnected ? true : false;
                myNewUser.emit('enterUser', newUser); 
            }
        });

        socket.on('disconnect', function () {
            delete allLoginUsers[socket.client.id];
            clients = io.of('/chat').clients();
            conClients = clients.connected
            for (var p in conClients) {
                if (allLoginUsers[conClients[p].client.id]['role'] == 'admin') {
                    conClients[p].emit('someoneDisconected', socket.client.id);
                }
            }
        });

        socket.on('chatToUser', function (data) {
            clients = io.of('/chat').clients();
            conClients = clients.connected
            for (var p in conClients) {
                if (allLoginUsers[conClients[p].client.id]['id'] == data.chatroom) {
                    conClients[p].emit('adminChatToUser', data);
                }
            }
        });

        socket.on('chatToAdmin', function (data) {
            currId = socket.client.id
            data.chatroom = currId;
            data.name = allLoginUsers[socket.client.id]['name']
            clients = io.of('/chat').clients();
            conClients = clients.connected
            for (var p in conClients) {
                if (allLoginUsers[conClients[p].client.id]['role'] == 'admin') {
                    conClients[p].emit('chatToAdmin', data);
                }
            }
        });
    });
});