app.controller('indexController', ['$scope', "indexFactory", ($scope, indexFactory) => {
    $scope.messages = [];
    $scope.players = {};
    $scope.init = () => {
        const username = this.prompt("enter nickname for chat and play");
        if (username) {
            initSocket(username);
        } else {
            return false;
        }
    };
    const showBubbleMsg = (id, message) => {
        $('#' + id).find('.message').show().html(message);
        setTimeout(() => {
            $('#' + id).find('.message').hide();
        }, 2000);
    };
    const scrlTop = () => {
        const element = document.getElementById("chat-area");
        element.scrollTop = element.scrollHeight;
    };

    async function initSocket(username) {
        const connectOpt = {
            reconnectionAttempts: 3,
            reconnectionDelay: 500,
        };
        const socket = await indexFactory.connectSocket("http://localhost:3000", connectOpt)
      try {
        socket.emit('newUser', {
            username
        });

        socket.on('initPlayers', (players) => {
            $scope.players = players;
            $scope.$apply();
        });

        socket.on('newUser', (data) => {
            const messageData = {
                type: {
                    code: 0, // server or user message
                    status: 1 // login or disconnect message
                }, // info
                username: data.username,

            };

            $scope.messages.push(messageData);
            $scope.players[data.id] = data;
            $scope.$apply();
            scrlTop();

        });

        socket.on('disUser', (data) => {
            const messageData = {
                type: {
                    code: 0, //0 client ,  1 server 
                    status: 0 //0 disconnect , 1 login                    
                },
                username: data.username
            };
            $scope.messages.push(messageData);
            delete $scope.players[data.id];
            $scope.$apply();
            scrlTop();


        });
        socket.on('animate', (data) => {

            $('#' + data.socketId).animate({
                "left": data.x,
                "top": data.y
            });

        });
        let animate = true
        $scope.onClickPlayer = ($event) => {
            if (animate) {
                console.log($event.offsetX);
                console.log($event.offsetY);


                animate = true;
                let x = $event.offsetX - 40;
                let y = $event.offsetY - 40;
                socket.emit("animate", {
                    x,
                    y
                });
                $('#' + socket.id).animate({
                    "left": x,
                    "top": y
                });

            }
        }
        $scope.newMessage = () => {
            let message = $scope.message;
            const messageData = {
                type: {
                    code: 1, // server or user message

                }, // info
                username,
                text: message

            };
            $scope.messages.push(messageData);
            $scope.message = "";
            socket.emit("msg", messageData);

            setTimeout(() => {
                scrlTop();
            });

            showBubbleMsg(socket.id, message);

        };
        socket.on("msg1", (data) => {
            console.log(data);

            $scope.messages.push(data);
            $scope.$apply();
            scrlTop();
            showBubbleMsg(socket.id, data.text);

        })
      } catch (error) {
          console.log(error);
      }


    }
}])