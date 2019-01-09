

app.controller('indexController',['$scope',"indexFactory",($scope,indexFactory)=>
{   $scope.messages=[];
   $scope.players={};
    $scope.init=()=>{
        const username=this.prompt("enter username");
        if(username){
            initSocket(username);
        }else{
            return false;
        }
    };
    function initSocket(username) {
       indexFactory.connectSocket("http://localhost:3000",{
        reconnectionAttempts:3,
        reconnectionDelay:500,
      
    }).then((socket) => {
				socket.emit('newUser', { username });

				socket.on('initPlayers', (players) => {
					$scope.players = players;
					$scope.$apply();
				});

				socket.on('newUser', (data) => {
					const messageData = {
						type: {
							code: 0, // server or user message
							message: 1 // login or disconnect message
						}, // info
						username: data.username,

					};

					$scope.messages.push(messageData);
					$scope.players[data.id] = data;
					$scope.$apply();
				});

        socket.on('disUser',(data)=>{
            const messageData={
                type:{
                    code:0,//0 client ,  1 server 
                    status:0 //0 disconnect , 1 login                    
                },
                username:data.username
            };
            $scope.messages.push(messageData);
               delete $scope.players[data.id];
               $scope.$apply();
         
        });
        socket.on('animate',(data)=>{
            
            $('#'+data.socketId).animate({"left": data.x,"top": data.y});
            
        });
        let animate = true
        $scope.onClickPlayer=($event)=>{    
            if(animate){
            console.log($event.offsetX);
            console.log($event.offsetY);    
            
        
                animate =true;
                let x=$event.offsetX-40;
                let y=$event.offsetY-40;
                socket.emit("animate",{x,y});
            $('#'+socket.id).animate({"left": x,"top": y});
        
        }
        }
          
    })
    .catch(err=>{
        console.log(err);
        
    })

}
}])